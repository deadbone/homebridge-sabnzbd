![homebridge-sabnzbd banner](branding/banner-sabnzbd.png)

# homebridge-sabnzbd

`homebridge-sabnzbd` is a Homebridge dynamic platform plugin for monitoring and controlling a SABnzbd instance through the official HTTP JSON API.

## Features

- Reachability and server state monitoring.
- Queue pause and resume from Apple Home.
- Momentary controls for temporary pause, preset speed limit, normal speed and manual refresh.
- Optional momentary control to clear SABnzbd warnings.
- Sensors for active downloads, queue presence, warnings and last failed download.
- Numeric status services for queue progress, download speed, free disk space, queue count and recent failures.
- Automatic reconnection after API errors, timeouts or temporary network loss.
- Homebridge Config UI X schema support.

Destructive actions such as deleting downloads, purging the queue, clearing history, shutting down SABnzbd or restarting SABnzbd are intentionally not implemented.

## Requirements

- Homebridge 2.x.
- Node.js versions supported by the current Homebridge release.
- SABnzbd 5.0.4 or another compatible stable 5.x release.

## Installation

```bash
npm install -g homebridge-sabnzbd
```

## Configuration

Use Homebridge Config UI X or add a platform block:

```json
{
  "platform": "Sabnzbd",
  "name": "SABnzbd",
  "url": "http://sabnzbd.example:8080",
  "apiKey": "YOUR_SABNZBD_API_KEY",
  "refreshIntervalSeconds": 30,
  "timeoutMs": 10000,
  "temporaryPauseMinutes": 15,
  "speedLimitPercent": 50,
  "recentFailureWindowHours": 24,
  "clearWarningsEnabled": false
}
```

The API key is never written to logs.

## HomeKit Mapping

- Main switch on: pause queue.
- Main switch off: resume queue.
- `Downloading`: occupancy sensor.
- `Queue`: contact sensor, open when the queue has items.
- `Warnings`: leak sensor, triggered when SABnzbd reports warnings.
- `Last Download Failed`: motion sensor.
- Light sensor services expose numeric values because HomeKit has no native SABnzbd service type.

## Development

```bash
npm install
npm run lint
npm test
npm run build
```

## Official References

- [Homebridge developer docs](https://developers.homebridge.io)
- [Homebridge plugin template](https://github.com/homebridge/homebridge-plugin-template)
- [Homebridge Verified Plugin requirements](https://github.com/homebridge/homebridge/wiki/verified-Plugins)
- [SABnzbd API reference](https://sabnzbd.org/wiki/configuration/5.0/api)

## License

MIT
