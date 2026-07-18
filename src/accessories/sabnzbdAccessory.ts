import type { CharacteristicValue, Logger, PlatformAccessory, Service } from 'homebridge';
import type { SabnzbdSnapshot } from '../models/sabnzbd.js';
import type { SabnzbdPlatform } from '../platform.js';

type NumericServiceKey = 'progress' | 'speed' | 'disk' | 'queue' | 'failures';

const numericServices: Record<NumericServiceKey, { readonly subtype: string; readonly name: string }> = {
  progress: { subtype: 'progress', name: 'Queue Progress' },
  speed: { subtype: 'speed', name: 'Download Speed' },
  disk: { subtype: 'disk', name: 'Free Disk Space' },
  queue: { subtype: 'queue', name: 'Queue Items' },
  failures: { subtype: 'failures', name: 'Recent Failures' },
};

export class SabnzbdAccessory {
  private readonly log: Logger;
  private readonly service: Service;
  private readonly activityService: Service;
  private readonly queueService: Service;
  private readonly warningService: Service;
  private readonly completionService: Service;
  private readonly temporaryPauseService: Service;
  private readonly speedLimitService: Service;
  private readonly normalSpeedService: Service;
  private readonly refreshService: Service;
  private readonly clearWarningsService?: Service;
  private readonly numeric: Record<NumericServiceKey, Service>;

  private snapshot?: SabnzbdSnapshot;

  public constructor(
    private readonly platform: SabnzbdPlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.log = this.platform.log;

    this.accessory
      .getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'SABnzbd')
      .setCharacteristic(this.platform.Characteristic.Model, 'SABnzbd HTTP API')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'homebridge-sabnzbd');

    this.service = this.getOrAddService(this.platform.Service.Switch, accessory.displayName);
    this.activityService = this.getOrAddService(this.platform.Service.OccupancySensor, 'Downloading');
    this.queueService = this.getOrAddService(this.platform.Service.ContactSensor, 'Queue');
    this.warningService = this.getOrAddService(this.platform.Service.LeakSensor, 'Warnings');
    this.completionService = this.getOrAddService(this.platform.Service.MotionSensor, 'Last Download Failed');
    this.temporaryPauseService = this.getOrAddService(this.platform.Service.Switch, 'Temporary Pause');
    this.speedLimitService = this.getOrAddService(this.platform.Service.Switch, 'Speed Limit');
    this.normalSpeedService = this.getOrAddService(this.platform.Service.Switch, 'Normal Speed');
    this.refreshService = this.getOrAddService(this.platform.Service.Switch, 'Refresh');
    this.clearWarningsService = this.platform.settings.clearWarningsEnabled
      ? this.getOrAddService(this.platform.Service.Switch, 'Clear Warnings')
      : undefined;
    this.numeric = {
      progress: this.getOrAddNumericService('progress'),
      speed: this.getOrAddNumericService('speed'),
      disk: this.getOrAddNumericService('disk'),
      queue: this.getOrAddNumericService('queue'),
      failures: this.getOrAddNumericService('failures'),
    };

    this.configureHandlers();
  }

  public update(snapshot: SabnzbdSnapshot): void {
    this.snapshot = snapshot;

    this.service.updateCharacteristic(this.platform.Characteristic.On, snapshot.paused);
    this.activityService.updateCharacteristic(
      this.platform.Characteristic.OccupancyDetected,
      snapshot.downloading
        ? this.platform.Characteristic.OccupancyDetected.OCCUPANCY_DETECTED
        : this.platform.Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED,
    );
    this.queueService.updateCharacteristic(
      this.platform.Characteristic.ContactSensorState,
      snapshot.queueNotEmpty
        ? this.platform.Characteristic.ContactSensorState.CONTACT_NOT_DETECTED
        : this.platform.Characteristic.ContactSensorState.CONTACT_DETECTED,
    );
    this.warningService.updateCharacteristic(
      this.platform.Characteristic.LeakDetected,
      snapshot.hasWarnings
        ? this.platform.Characteristic.LeakDetected.LEAK_DETECTED
        : this.platform.Characteristic.LeakDetected.LEAK_NOT_DETECTED,
    );
    this.completionService.updateCharacteristic(
      this.platform.Characteristic.MotionDetected,
      snapshot.lastDownloadFailed,
    );

    this.updateNumeric('progress', snapshot.progressPercent, `${snapshot.progressPercent}%`);
    this.updateNumeric('speed', Math.min(snapshot.speedKbps, 100000), `${snapshot.speedLabel}/s`);
    this.updateNumeric('disk', Math.min(snapshot.diskFreeGb, 100000), snapshot.diskFreeLabel);
    this.updateNumeric('queue', snapshot.queueCount, `${snapshot.queueCount}`);
    this.updateNumeric('failures', snapshot.recentFailureCount, `${snapshot.recentFailureCount}`);

    this.accessory
      .getService(this.platform.Service.AccessoryInformation)!
      .updateCharacteristic(this.platform.Characteristic.FirmwareRevision, snapshot.version);
  }

  private configureHandlers(): void {
    this.service
      .getCharacteristic(this.platform.Characteristic.On)
      .onGet(() => this.snapshot?.paused ?? false)
      .onSet(async (value: CharacteristicValue) => {
        if (value === true) {
          await this.platform.client.pauseQueue();
          this.log.info('SABnzbd queue paused from HomeKit.');
        } else {
          await this.platform.client.resumeQueue();
          this.log.info('SABnzbd queue resumed from HomeKit.');
        }

        await this.platform.refreshNow();
      });

    this.service
      .getCharacteristic(this.platform.Characteristic.ConfiguredName)
      .onGet(() => this.accessory.displayName);

    this.configureMomentarySwitch(
      this.temporaryPauseService,
      async () => {
        await this.platform.client.temporaryPause(this.platform.settings.temporaryPauseMinutes);
        this.log.info(
          `SABnzbd queue temporarily paused for ${this.platform.settings.temporaryPauseMinutes} minutes from HomeKit.`,
        );
      },
      'Temporary Pause',
    );

    this.configureMomentarySwitch(
      this.speedLimitService,
      async () => {
        await this.platform.client.setSpeedLimit(this.platform.settings.speedLimitPercent);
        this.log.info(
          `SABnzbd speed limit set to ${this.platform.settings.speedLimitPercent}% from HomeKit.`,
        );
      },
      'Speed Limit',
    );

    this.configureMomentarySwitch(
      this.normalSpeedService,
      async () => {
        await this.platform.client.setSpeedLimit(100);
        this.log.info('SABnzbd speed limit reset to 100% from HomeKit.');
      },
      'Normal Speed',
    );

    this.configureMomentarySwitch(
      this.refreshService,
      async () => {
        await this.platform.refreshNow();
        this.log.info('SABnzbd state refreshed from HomeKit.');
      },
      'Refresh',
    );

    if (this.clearWarningsService) {
      this.configureMomentarySwitch(
        this.clearWarningsService,
        async () => {
          await this.platform.client.clearWarnings();
          this.log.info('SABnzbd warnings cleared from HomeKit.');
        },
        'Clear Warnings',
      );
    }
  }

  private configureMomentarySwitch(
    service: Service,
    action: () => Promise<void>,
    name: string,
  ): void {
    service.setCharacteristic(this.platform.Characteristic.ConfiguredName, name);
    service
      .getCharacteristic(this.platform.Characteristic.On)
      .onGet(() => false)
      .onSet(async (value: CharacteristicValue) => {
        if (value !== true) {
          return;
        }

        try {
          await action();
          await this.platform.refreshNow();
        } finally {
          service.updateCharacteristic(this.platform.Characteristic.On, false);
        }
      });
  }

  private getOrAddService(serviceType: typeof Service, name: string): Service {
    const subtype = name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-');
    return this.accessory.getService(name) ?? this.accessory.addService(serviceType, name, subtype);
  }

  private getOrAddNumericService(key: NumericServiceKey): Service {
    const definition = numericServices[key];
    const service =
      this.accessory.getServiceById(this.platform.Service.LightSensor, definition.subtype) ??
      this.accessory.addService(
        this.platform.Service.LightSensor,
        definition.name,
        definition.subtype,
      );

    service.setCharacteristic(this.platform.Characteristic.ConfiguredName, definition.name);
    return service;
  }

  private updateNumeric(key: NumericServiceKey, value: number, displayName: string): void {
    const service = this.numeric[key];
    service.updateCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel, Math.max(value, 0.0001));
    service.updateCharacteristic(this.platform.Characteristic.StatusActive, this.snapshot?.reachable ?? false);
    service.updateCharacteristic(
      this.platform.Characteristic.Name,
      `${numericServices[key].name}: ${displayName}`,
    );
  }
}
