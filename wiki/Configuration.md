# Configuration

## Minimal Example

```json
{
  "platform": "Sabnzbd",
  "name": "SABnzbd",
  "url": "http://sabnzbd.example:8080",
  "apiKey": "YOUR_SABNZBD_API_KEY"
}
```

## Full Example

```json
{
  "platform": "Sabnzbd",
  "name": "SABnzbd",
  "url": "http://sabnzbd.example:8080",
  "apiKey": "YOUR_SABNZBD_API_KEY",
  "timeoutMs": 10000,
  "refreshIntervalSeconds": 30,
  "temporaryPauseMinutes": 15,
  "speedLimitPercent": 50,
  "recentFailureWindowHours": 24,
  "clearWarningsEnabled": false
}
```

## Options

| Option | Default | Description |
| --- | --- | --- |
| `platform` | `Sabnzbd` | Homebridge platform alias. |
| `name` | `SABnzbd` | Accessory name shown in HomeKit. |
| `url` | required | SABnzbd base URL, using `http` or `https`. |
| `apiKey` | required | SABnzbd API key from **Config > General > Security**. |
| `timeoutMs` | `10000` | HTTP timeout in milliseconds. |
| `refreshIntervalSeconds` | `30` | Polling interval. Minimum `10`. |
| `temporaryPauseMinutes` | `15` | Duration used by the temporary pause switch. |
| `speedLimitPercent` | `50` | Speed limit used by the preset speed switch. |
| `recentFailureWindowHours` | `24` | Window for counting recent failed history items. |
| `clearWarningsEnabled` | `false` | Exposes the clear warnings switch only when enabled. |

## API Key

The API key is stored in Homebridge configuration and rendered as a password field by Homebridge UI. The plugin never logs it.

## Francais

La configuration minimale contient `platform`, `url` et `apiKey`. La clé API se trouve dans SABnzbd sous **Config > General > Security**. Le champ est masqué dans Homebridge UI et n'est jamais journalisé.
