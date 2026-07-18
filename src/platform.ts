import type {
  API,
  Characteristic,
  DynamicPlatformPlugin,
  Logger,
  PlatformAccessory,
  Service,
} from 'homebridge';
import { SabnzbdAccessory } from './accessories/sabnzbdAccessory.js';
import { SabnzbdApi } from './sabnzbd-api.js';
import {
  normalizeConfig,
  PLUGIN_NAME,
  type NormalizedSabnzbdConfig,
  type SabnzbdPlatformConfig,
  validateConfig,
} from './settings.js';

interface SabnzbdAccessoryContext {
  deviceId?: string;
}

const ACCESSORY_ID = 'sabnzbd-main';

export class SabnzbdPlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service;
  public readonly Characteristic: typeof Characteristic;
  public readonly client: SabnzbdApi;
  public readonly settings: NormalizedSabnzbdConfig;

  private readonly cachedAccessories = new Map<string, PlatformAccessory<SabnzbdAccessoryContext>>();
  private readonly accessories = new Map<string, SabnzbdAccessory>();
  private refreshTimer?: NodeJS.Timeout;
  private refreshing = false;

  public constructor(
    public readonly log: Logger,
    rawConfig: SabnzbdPlatformConfig,
    public readonly api: API,
  ) {
    this.Service = api.hap.Service;
    this.Characteristic = api.hap.Characteristic;
    this.settings = normalizeConfig(rawConfig);
    this.client = new SabnzbdApi(this.settings, log);

    const errors = validateConfig(this.settings);
    if (errors.length > 0) {
      for (const error of errors) {
        this.log.error(error);
      }
      this.log.warn('homebridge-sabnzbd is not configured; no SABnzbd accessory will be created.');
      return;
    }

    this.api.on('didFinishLaunching', () => {
      this.discoverDevices();
      void this.refreshNow();
      this.startPolling();
    });

    this.api.on('shutdown', () => {
      this.stopPolling();
    });
  }

  public configureAccessory(accessory: PlatformAccessory<SabnzbdAccessoryContext>): void {
    const deviceId = accessory.context.deviceId ?? ACCESSORY_ID;
    this.cachedAccessories.set(deviceId, accessory);
  }

  public async refreshNow(): Promise<void> {
    if (this.refreshing) {
      return;
    }

    this.refreshing = true;
    try {
      const snapshot = await this.client.getSnapshot();
      for (const accessory of this.accessories.values()) {
        accessory.update(snapshot);
      }

      if (snapshot.reachable) {
        this.log.debug(
          `SABnzbd ${snapshot.version}: ${snapshot.status}, queue=${snapshot.queueCount}, speed=${snapshot.speedLabel}/s, eta=${snapshot.eta}.`,
        );
      } else {
        this.log.warn(`SABnzbd is unavailable: ${snapshot.errorMessage ?? 'unknown error'}`);
      }
    } finally {
      this.refreshing = false;
    }
  }

  private discoverDevices(): void {
    const uuid = this.api.hap.uuid.generate(`${PLUGIN_NAME}:${ACCESSORY_ID}`);
    const existingAccessory = this.cachedAccessories.get(ACCESSORY_ID);

    if (existingAccessory) {
      existingAccessory.updateDisplayName(this.settings.name);
      this.accessories.set(ACCESSORY_ID, new SabnzbdAccessory(this, existingAccessory));
      return;
    }

    const accessory = new this.api.platformAccessory<SabnzbdAccessoryContext>(
      this.settings.name,
      uuid,
      this.api.hap.Categories.SWITCH,
    );
    accessory.context.deviceId = ACCESSORY_ID;

    this.accessories.set(ACCESSORY_ID, new SabnzbdAccessory(this, accessory));
    this.api.registerPlatformAccessories(PLUGIN_NAME, 'Sabnzbd', [accessory]);
    this.log.info(`Added SABnzbd accessory "${this.settings.name}".`);
  }

  private startPolling(): void {
    this.stopPolling();
    this.refreshTimer = setInterval(
      () => void this.refreshNow(),
      this.settings.refreshIntervalSeconds * 1000,
    );
  }

  private stopPolling(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  }
}
