import { describe, expect, it } from 'vitest';
import { normalizeConfig, validateConfig } from '../src/settings.js';

describe('settings', () => {
  it('normalizes defaults and trims trailing slash', () => {
    const config = normalizeConfig({
      platform: 'Sabnzbd',
      url: 'http://sabnzbd.example:8080/',
      apiKey: 'secret',
    });

    expect(config.url).toBe('http://sabnzbd.example:8080');
    expect(config.name).toBe('SABnzbd');
    expect(config.refreshIntervalSeconds).toBe(30);
    expect(validateConfig(config)).toEqual([]);
  });

  it('reports missing required values', () => {
    const config = normalizeConfig({ platform: 'Sabnzbd' });

    expect(validateConfig(config)).toEqual([
      'SABnzbd URL is required.',
      'SABnzbd API key is required.',
      'SABnzbd URL must be a valid URL.',
    ]);
  });
});
