import type { API } from 'homebridge';
import { SabnzbdPlatform } from './platform.js';
import { PLUGIN_ALIAS, PLUGIN_NAME } from './settings.js';

export default (api: API): void => {
  api.registerPlatform(PLUGIN_NAME, PLUGIN_ALIAS, SabnzbdPlatform);
};
