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

## Exemple Minimal

```json
{
  "platform": "Sabnzbd",
  "name": "SABnzbd",
  "url": "http://sabnzbd.example:8080",
  "apiKey": "YOUR_SABNZBD_API_KEY"
}
```

## Exemple Complet

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

| Option | Défaut | Description |
| --- | --- | --- |
| `platform` | `Sabnzbd` | Alias de plateforme Homebridge. |
| `name` | `SABnzbd` | Nom de l'accessoire affiché dans HomeKit. |
| `url` | obligatoire | URL de base SABnzbd, en `http` ou `https`. |
| `apiKey` | obligatoire | Clé API SABnzbd depuis **Config > General > Security**. |
| `timeoutMs` | `10000` | Timeout HTTP en millisecondes. |
| `refreshIntervalSeconds` | `30` | Intervalle de polling. Minimum `10`. |
| `temporaryPauseMinutes` | `15` | Durée utilisée par l'interrupteur de pause temporaire. |
| `speedLimitPercent` | `50` | Limite de vitesse utilisée par l'interrupteur prédéfini. |
| `recentFailureWindowHours` | `24` | Fenêtre utilisée pour compter les échecs récents dans l'historique. |
| `clearWarningsEnabled` | `false` | Expose l'interrupteur d'effacement des avertissements uniquement si activé. |

## Clé API

La clé API est stockée dans la configuration Homebridge et rendue comme champ mot de passe par Homebridge UI. Le plugin ne l'écrit jamais dans les logs.
