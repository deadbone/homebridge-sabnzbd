import { afterEach, describe, expect, it, vi } from 'vitest';
import { SabnzbdApi } from '../src/sabnzbd-api.js';
import type { NormalizedSabnzbdConfig } from '../src/settings.js';

const config: NormalizedSabnzbdConfig = {
  platform: 'Sabnzbd',
  name: 'SABnzbd',
  url: 'http://sabnzbd.example:8080',
  apiKey: 'secret',
  timeoutMs: 1000,
  refreshIntervalSeconds: 30,
  temporaryPauseMinutes: 15,
  speedLimitPercent: 50,
  recentFailureWindowHours: 24,
  clearWarningsEnabled: false,
  exposeDebugInfo: false,
};

const log = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
} as never;

describe('SabnzbdApi', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('maps queue, history and status responses to a snapshot', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url: URL) => {
        const mode = url.searchParams.get('mode');
        const body =
          mode === 'queue'
            ? {
                queue: {
                  status: 'Downloading',
                  paused: false,
                  noofslots_total: 2,
                  timeleft: '0:10:00',
                  speed: '10 M',
                  kbpersec: '10240',
                  mb: '100',
                  mbleft: '25',
                  diskspace1: '42.5',
                  diskspace1_norm: '42.5 G',
                  have_warnings: '0',
                  version: '5.0.4',
                  slots: [{ status: 'Downloading' }, { status: 'Queued' }],
                },
              }
            : mode === 'history'
              ? {
                  history: {
                    slots: [{ status: 'Completed', completed: Date.now() / 1000 }],
                  },
                }
              : { status: { have_warnings: '0', warnings: [] } };

        return Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
      }),
    );

    const snapshot = await new SabnzbdApi(config, log).getSnapshot();

    expect(snapshot.reachable).toBe(true);
    expect(snapshot.version).toBe('5.0.4');
    expect(snapshot.downloading).toBe(true);
    expect(snapshot.progressPercent).toBe(75);
    expect(snapshot.queueCount).toBe(2);
  });

  it('does not expose clear warnings unless explicitly enabled', async () => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);

    await expect(new SabnzbdApi(config, log).clearWarnings()).rejects.toThrow(
      'Clearing SABnzbd warnings is disabled',
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it('marks the snapshot unavailable when one of the required API requests fails', async () => {
    vi.stubGlobal('fetch', vi.fn((url: URL) => {
      switch (url.searchParams.get('mode')) {
        case 'queue':
          return Promise.resolve(Response.json({ queue: { status: 'Downloading', slots: [{ status: 'Downloading' }] } }));
        case 'status':
          return Promise.resolve(Response.json({ status: {} }));
        default:
          return Promise.resolve(new Response(null, { status: 503 }));
      }
    }));

    const snapshot = await new SabnzbdApi(config, log).getSnapshot();

    expect(snapshot).toMatchObject({
      reachable: false,
      status: 'Unavailable',
      downloading: false,
      hasWarnings: true,
      errorMessage: 'SABnzbd returned HTTP 503.',
    });
  });

  it('aborts a pending command at the configured timeout', async () => {
    vi.useFakeTimers();
    const fetch = vi.fn((_url: URL, { signal }: { signal: AbortSignal }) => new Promise<Response>((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('The operation was aborted.', 'AbortError')), { once: true });
    }));
    vi.stubGlobal('fetch', fetch);

    const command = new SabnzbdApi(config, log).pauseQueue();
    const timeout = expect(command).rejects.toThrow(`SABnzbd request timed out after ${config.timeoutMs}ms.`);
    const signal = fetch.mock.calls[0]?.[1].signal;
    await vi.advanceTimersByTimeAsync(config.timeoutMs - 1);
    expect(signal?.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);

    await timeout;
    expect(signal?.aborted).toBe(true);
  });

  it('reports a rejected command even if the HTTP response was successful', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ status: false })));

    await expect(new SabnzbdApi(config, log).resumeQueue()).rejects.toThrow('SABnzbd command failed.');
  });
});
