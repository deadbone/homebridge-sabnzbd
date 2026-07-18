import { describe, expect, it, vi } from 'vitest';
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
    await expect(new SabnzbdApi(config, log).clearWarnings()).rejects.toThrow(
      'Clearing SABnzbd warnings is disabled',
    );
  });
});
