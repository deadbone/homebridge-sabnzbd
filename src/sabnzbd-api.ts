import type { Logger } from 'homebridge';
import type { NormalizedSabnzbdConfig } from './settings.js';
import type {
  SabnzbdCommandResponse,
  SabnzbdHistoryResponse,
  SabnzbdQueueResponse,
  SabnzbdSnapshot,
  SabnzbdStatusResponse,
} from './models/sabnzbd.js';
import { clampPercent, toBoolean, toNumber } from './utils/numbers.js';
import { messageFromError } from './utils/redact.js';

type SabnzbdMode = 'queue' | 'history' | 'status' | 'pause' | 'resume' | 'config' | 'warnings';

export class SabnzbdApi {
  public constructor(
    private readonly config: NormalizedSabnzbdConfig,
    private readonly log: Logger,
  ) {}

  public async getSnapshot(): Promise<SabnzbdSnapshot> {
    try {
      const [queue, history, status] = await Promise.all([
        this.request<SabnzbdQueueResponse>('queue', { limit: '20' }),
        this.request<SabnzbdHistoryResponse>('history', { limit: '20' }),
        this.request<SabnzbdStatusResponse>('status', { skip_dashboard: '1' }),
      ]);

      return this.toSnapshot(queue, history, status);
    } catch (error) {
      const errorMessage = messageFromError(error);
      this.log.debug(`Unable to refresh SABnzbd state: ${errorMessage}`);

      return {
        reachable: false,
        version: 'unknown',
        status: 'Unavailable',
        paused: false,
        downloading: false,
        queueNotEmpty: false,
        hasWarnings: true,
        lastDownloadFailed: false,
        lastDownloadCompleted: false,
        progressPercent: 0,
        speedKbps: 0,
        speedLabel: '0',
        eta: 'unknown',
        diskFreeGb: 0,
        diskFreeLabel: 'unknown',
        queueCount: 0,
        recentFailureCount: 0,
        updatedAt: new Date(),
        errorMessage,
      };
    }
  }

  public async pauseQueue(): Promise<void> {
    await this.expectStatus(this.request<SabnzbdCommandResponse>('pause'));
  }

  public async resumeQueue(): Promise<void> {
    await this.expectStatus(this.request<SabnzbdCommandResponse>('resume'));
  }

  public async temporaryPause(minutes: number): Promise<void> {
    await this.expectStatus(
      this.request<SabnzbdCommandResponse>('config', {
        name: 'set_pause',
        value: String(minutes),
      }),
    );
  }

  public async setSpeedLimit(percent: number): Promise<void> {
    await this.expectStatus(
      this.request<SabnzbdCommandResponse>('config', {
        name: 'speedlimit',
        value: String(percent),
      }),
    );
  }

  public async clearWarnings(): Promise<void> {
    if (!this.config.clearWarningsEnabled) {
      throw new Error('Clearing SABnzbd warnings is disabled in the plugin configuration.');
    }

    await this.expectStatus(this.request<SabnzbdCommandResponse>('warnings', { name: 'clear' }));
  }

  private async request<T>(mode: SabnzbdMode, params: Record<string, string> = {}): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      const url = new URL(`${this.config.url}/api`);
      url.searchParams.set('output', 'json');
      url.searchParams.set('apikey', this.config.apiKey);
      url.searchParams.set('mode', mode);

      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
      }

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          accept: 'application/json',
          'user-agent': 'homebridge-sabnzbd',
        },
      });

      if (!response.ok) {
        throw new Error(`SABnzbd returned HTTP ${response.status}.`);
      }

      const body = (await response.json()) as unknown;
      if (isApiError(body)) {
        throw new Error(body.error);
      }

      return body as T;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`SABnzbd request timed out after ${this.config.timeoutMs}ms.`);
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  private async expectStatus(promise: Promise<SabnzbdCommandResponse>): Promise<void> {
    const response = await promise;
    if (response.status === false) {
      throw new Error(response.error ?? 'SABnzbd command failed.');
    }
  }

  private toSnapshot(
    queueResponse: SabnzbdQueueResponse,
    historyResponse: SabnzbdHistoryResponse,
    statusResponse: SabnzbdStatusResponse,
  ): SabnzbdSnapshot {
    const queue = queueResponse.queue;
    const history = historyResponse.history;
    const status = statusResponse.status;
    const slots = queue.slots ?? [];
    const historySlots = history.slots ?? [];
    const mb = toNumber(queue.mb);
    const mbLeft = toNumber(queue.mbleft);
    const downloadedMb = Math.max(mb - mbLeft, 0);
    const progressPercent = mb > 0 ? clampPercent((downloadedMb / mb) * 100) : 0;
    const recentSince = Date.now() / 1000 - this.config.recentFailureWindowHours * 60 * 60;
    const lastHistoryItem = historySlots[0];
    const hasWarnings = toBoolean(queue.have_warnings) || toBoolean(status.have_warnings);
    const diskFreeGb = Math.max(toNumber(queue.diskspace1), toNumber(queue.diskspace2));

    return {
      reachable: true,
      version: queue.version ?? status.version ?? 'unknown',
      status: queue.status ?? 'Idle',
      paused: toBoolean(queue.paused) || toBoolean(queue.paused_all),
      downloading: slots.some((slot) => slot.status?.toLowerCase() === 'downloading'),
      queueNotEmpty: slots.length > 0 || toNumber(queue.noofslots_total) > 0,
      hasWarnings,
      lastDownloadFailed: lastHistoryItem?.status === 'Failed',
      lastDownloadCompleted: lastHistoryItem?.status === 'Completed',
      progressPercent,
      speedKbps: toNumber(queue.kbpersec),
      speedLabel: queue.speed ?? '0',
      eta: queue.timeleft ?? '0:00:00',
      diskFreeGb,
      diskFreeLabel: queue.diskspace1_norm ?? queue.diskspace2_norm ?? `${diskFreeGb.toFixed(1)} G`,
      queueCount: Math.round(toNumber(queue.noofslots_total, slots.length)),
      recentFailureCount: historySlots.filter(
        (slot) =>
          slot.status === 'Failed' &&
          toNumber(slot.completed, toNumber(slot.time_added)) >= recentSince,
      ).length,
      updatedAt: new Date(),
    };
  }
}

function isApiError(value: unknown): value is { readonly error: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof (value as { readonly error: unknown }).error === 'string'
  );
}
