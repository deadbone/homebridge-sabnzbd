import type { PlatformConfig } from 'homebridge';

export const PLATFORM_NAME = 'SabnzbdPlatform';
export const PLUGIN_ALIAS = 'Sabnzbd';
export const PLUGIN_NAME = 'homebridge-sabnzbd';

export interface SabnzbdPlatformConfig extends PlatformConfig {
  platform: typeof PLUGIN_ALIAS;
  name?: string;
  url?: string;
  apiKey?: string;
  timeoutMs?: number;
  refreshIntervalSeconds?: number;
  temporaryPauseMinutes?: number;
  speedLimitPercent?: number;
  recentFailureWindowHours?: number;
  clearWarningsEnabled?: boolean;
  exposeDebugInfo?: boolean;
}

export interface NormalizedSabnzbdConfig {
  readonly platform: typeof PLUGIN_ALIAS;
  readonly name: string;
  readonly url: string;
  readonly apiKey: string;
  readonly timeoutMs: number;
  readonly refreshIntervalSeconds: number;
  readonly temporaryPauseMinutes: number;
  readonly speedLimitPercent: number;
  readonly recentFailureWindowHours: number;
  readonly clearWarningsEnabled: boolean;
  readonly exposeDebugInfo: boolean;
}

export function normalizeConfig(config: SabnzbdPlatformConfig): NormalizedSabnzbdConfig {
  const url = typeof config.url === 'string' ? config.url.trim() : '';
  const apiKey = typeof config.apiKey === 'string' ? config.apiKey.trim() : '';

  return {
    platform: PLUGIN_ALIAS,
    name: stringValue(config.name, 'SABnzbd'),
    url: normalizeUrl(url),
    apiKey,
    timeoutMs: integerValue(config.timeoutMs, 10000, 1000, 120000),
    refreshIntervalSeconds: integerValue(config.refreshIntervalSeconds, 30, 10, 3600),
    temporaryPauseMinutes: integerValue(config.temporaryPauseMinutes, 15, 1, 1440),
    speedLimitPercent: integerValue(config.speedLimitPercent, 50, 1, 100),
    recentFailureWindowHours: integerValue(config.recentFailureWindowHours, 24, 1, 720),
    clearWarningsEnabled: config.clearWarningsEnabled === true,
    exposeDebugInfo: config.exposeDebugInfo === true,
  };
}

export function validateConfig(config: NormalizedSabnzbdConfig): string[] {
  const errors: string[] = [];

  if (config.url.length === 0) {
    errors.push('SABnzbd URL is required.');
  }

  if (config.apiKey.length === 0) {
    errors.push('SABnzbd API key is required.');
  }

  try {
    const parsed = new URL(config.url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      errors.push('SABnzbd URL must use http or https.');
    }
  } catch {
    errors.push('SABnzbd URL must be a valid URL.');
  }

  return errors;
}

function normalizeUrl(value: string): string {
  if (value.length === 0) {
    return '';
  }

  return value.endsWith('/') ? value.slice(0, -1) : value;
}

function stringValue(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

function integerValue(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(Math.max(Math.round(value), min), max);
}
