![homebridge-sabnzbd banner](branding/banner-sabnzbd.png)

# homebridge-sabnzbd

## English

Dynamic Homebridge platform plugin for monitoring and controlling a SABnzbd instance from Apple Home.

> Initial release: this plugin is versioned as `0.1.0`.

> Safety notice: destructive SABnzbd actions are intentionally not implemented. The plugin cannot delete downloads, purge the queue, clear history, shut down SABnzbd, or restart SABnzbd.

The plugin uses the official SABnzbd HTTP JSON API:

```text
GET http://<sabnzbd-host>:8080/api?output=json&mode=<mode>&apikey=<api-key>
```

HTTPS can be configured by using an `https://` URL. The plugin does not disable TLS verification globally. If your SABnzbd instance uses a self-signed local certificate and Node.js rejects it, prefer HTTP on a trusted local network or install a trusted certificate.

### Compatibility

- Homebridge: `^2.0.0`
- Node.js: `^22 || ^24`
- SABnzbd: stable 5.x API, developed against SABnzbd 5.0.4
- Plugin type: dynamic platform
- Module format: ESM

Homebridge 2 compatibility is based on the official dynamic platform model and uses `onGet` and `onSet` characteristic handlers.

### What It Exposes

The plugin creates one SABnzbd accessory with supported HomeKit services:

- Main switch: on pauses the queue, off resumes the queue.
- `Temporary Pause`: momentary switch using the configured pause duration.
- `Speed Limit`: momentary switch applying the configured speed limit percentage.
- `Normal Speed`: momentary switch restoring the speed limit to `100%`.
- `Refresh`: momentary switch that triggers an immediate API refresh.
- `Clear Warnings`: optional momentary switch, only exposed when explicitly enabled.
- `Downloading`: occupancy sensor.
- `Queue`: contact sensor, open when queue items exist.
- `Warnings`: leak sensor, triggered when SABnzbd reports warnings.
- `Last Download Failed`: motion sensor.
- Numeric status services for queue progress, download speed, free disk space, queue count, and recent failures.

HomeKit does not provide native SABnzbd service types, so numeric values are exposed through standard HomeKit numeric services.

### Installation

#### Homebridge UI

After the package is published to npm, install it from Homebridge UI:

1. Open Homebridge UI.
2. Go to **Plugins**.
3. Search for `homebridge-sabnzbd`.
4. Click **Install**.
5. Restart Homebridge.

#### npm

```sh
npm install -g homebridge-sabnzbd
```

#### Local Development Install

```sh
npm install
npm run build
npm link
```

### SABnzbd API Key

Create or retrieve the API key in SABnzbd from **Config > General > Security**. The plugin sends it only as the SABnzbd API key query parameter to the configured URL.

The key is configured as a Homebridge UI password field and is never logged by the plugin.

### Homebridge UI Configuration

The plugin ships a `config.schema.json`, so Homebridge UI can render the configuration form without a custom UI.

Sections:

- Connection: accessory name, SABnzbd URL, API key, HTTP timeout, refresh interval.
- Controls: temporary pause duration, preset speed limit, recent failure window, optional warning-clear switch.

Detailed configuration documentation is available in the repository wiki.

### Scoped Homebridge Plugin Compatibility

Homebridge scoped plugins use the npm organization `@homebridge-plugins/`. A future scoped package for this plugin would therefore be named:

```text
@homebridge-plugins/homebridge-sabnzbd
```

Only the Homebridge collaborators team can initially publish packages under that scope. The current public package remains:

```text
homebridge-sabnzbd
```

The plugin keeps a stable HomeKit accessory UUID namespace that does not depend on whether the npm package is scoped or unscoped. This is intended to make a future scoped migration safe for existing HomeKit accessories, rooms, scenes, and automations when following the Homebridge scoped-plugin migration process.

### Example Configuration

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

### Home App Automation Examples

Pause SABnzbd when someone starts a video call:

1. A HomeKit scene or automation turns on the main `SABnzbd` switch.
2. Homebridge sends `mode=pause` to SABnzbd.
3. The queue stays paused until the switch is turned off.

Temporarily slow downloads in the evening:

1. A scheduled Apple Home automation turns on `Speed Limit`.
2. The plugin applies the configured percentage, such as `50%`.
3. Another automation turns on `Normal Speed` later.

Surface failures:

1. The plugin polls SABnzbd history.
2. If the latest download failed, `Last Download Failed` is triggered.
3. Home automations can use that sensor to notify you through HomeKit-compatible channels.

### Polling And State

The plugin refreshes SABnzbd state on a fixed interval and after HomeKit commands. Each refresh combines:

- `mode=queue`
- `mode=history`
- `mode=status`

Temporary connection loss, timeouts, authentication failures, and API errors are logged clearly. The plugin keeps running and refreshes again on the next interval.

### TODO

- Add richer optional status services when HomeKit provides better native mappings.
- Add integration tests against recorded SABnzbd API fixtures.
- Add optional custom characteristic documentation for Homebridge UI users.
- Add screenshots once the plugin is tested in a real Home app setup.

### Troubleshooting

`SABnzbd URL is required`: configure the full SABnzbd base URL, for example `http://sabnzbd.example:8080`.

`SABnzbd API key is required`: copy the API key from SABnzbd **Config > General > Security**.

`SABnzbd returned HTTP 403` or authentication errors: verify the API key and make sure there are no extra spaces.

Timeout or unreachable instance: verify that Homebridge can reach SABnzbd on the configured host, protocol, and port.

No values update in Apple Home: check the Homebridge log first, then reduce `refreshIntervalSeconds` only after confirming the API is reachable.

### Security

- No cloud service is used.
- No telemetry is included.
- The plugin talks only to the configured SABnzbd URL.
- Only `http` and `https` URLs are accepted.
- API keys are never written to logs.
- Destructive SABnzbd actions are not implemented.
- TLS validation is not disabled globally.
- Polling is bounded by `refreshIntervalSeconds` and `timeoutMs`.

### Development

```sh
npm install
npm run lint
npm run build
npm test
npm_config_cache=/private/tmp/homebridge-sabnzbd-npm-cache npm pack --dry-run
```

Tests mock the SABnzbd API and do not require a real SABnzbd instance.

### Publishing

Publishing is automated through GitHub Actions and npm Trusted Publishing. No npm token is required or configured in GitHub.

Before the first automated publish, configure the npm package Trusted Publisher:

- Organization or user: `deadbone`
- Repository: `homebridge-sabnzbd`
- Workflow filename: `publish.yml`
- Allowed actions: `npm publish`
- Environment name: leave empty

Release checklist:

1. Confirm repository, bugs, homepage, author, and license metadata.
2. Update `package.json` version and `CHANGELOG.md`.
3. Run `npm run lint`, `npm run build`, `npm test`, and `npm pack --dry-run`.
4. Commit the release changes.
5. Create and push a matching tag, for example `git tag v0.1.0 && git push origin v0.1.0`.
6. Create the GitHub Release after the workflow publishes the package.

The publish workflow runs only for tags matching `v*`. It installs Node.js 24.x and the latest npm, runs `npm ci`, verifies that the tag is exactly `v${package.json.version}`, runs lint, build, tests, and `npm pack --dry-run`, then publishes with `npm publish` using npm Trusted Publishing.

For a future scoped package, use `npm publish --access=public` in the workflow for the first scoped publication.

## Francais

Plugin de plateforme dynamique Homebridge permettant de superviser et piloter une instance SABnzbd depuis Apple Maison.

> Version initiale : ce plugin est actuellement en `0.1.0`.

> Note de sécurité : les actions destructrices SABnzbd ne sont volontairement pas implémentées. Le plugin ne peut pas supprimer de téléchargements, purger la file, effacer l'historique, arrêter SABnzbd ou redémarrer SABnzbd.

Le plugin utilise l'API HTTP JSON officielle de SABnzbd :

```text
GET http://<hote-sabnzbd>:8080/api?output=json&mode=<mode>&apikey=<cle-api>
```

HTTPS peut être configuré avec une URL `https://`. Le plugin ne désactive pas globalement la vérification TLS. Si votre instance SABnzbd utilise un certificat local autosigné et que Node.js le refuse, privilégiez HTTP sur un réseau local de confiance ou installez un certificat fiable.

### Compatibilite

- Homebridge : `^2.0.0`
- Node.js : `^22 || ^24`
- SABnzbd : API stable 5.x, développé contre SABnzbd 5.0.4
- Type de plugin : plateforme dynamique
- Format de module : ESM

La compatibilité Homebridge 2 repose sur le modèle officiel de plateforme dynamique et utilise les gestionnaires de caractéristiques `onGet` et `onSet`.

### Ce Que Le Plugin Expose

Le plugin crée un accessoire SABnzbd avec des services HomeKit pris en charge :

- Interrupteur principal : activé, il met la file en pause ; désactivé, il reprend la file.
- `Temporary Pause` : interrupteur momentané utilisant la durée de pause configurée.
- `Speed Limit` : interrupteur momentané appliquant la limite de vitesse configurée.
- `Normal Speed` : interrupteur momentané restaurant la limite à `100%`.
- `Refresh` : interrupteur momentané déclenchant un rafraichissement immédiat.
- `Clear Warnings` : interrupteur momentané optionnel, exposé uniquement si activé.
- `Downloading` : capteur d'occupation.
- `Queue` : capteur de contact, ouvert quand la file contient des éléments.
- `Warnings` : capteur de fuite, actif quand SABnzbd signale des avertissements.
- `Last Download Failed` : capteur de mouvement.
- Services numériques pour progression, vitesse, espace disque libre, nombre d'éléments et échecs récents.

HomeKit ne fournit pas de types de services SABnzbd natifs ; les valeurs numériques utilisent donc des services HomeKit standards.

### Installation

#### Homebridge UI

Une fois le paquet publié sur npm, installez-le depuis Homebridge UI :

1. Ouvrez Homebridge UI.
2. Allez dans **Plugins**.
3. Recherchez `homebridge-sabnzbd`.
4. Cliquez sur **Install**.
5. Redémarrez Homebridge.

#### npm

```sh
npm install -g homebridge-sabnzbd
```

#### Installation Locale De Developpement

```sh
npm install
npm run build
npm link
```

### Cle API SABnzbd

Créez ou récupérez la clé API dans SABnzbd depuis **Config > General > Security**. Le plugin l'envoie uniquement comme paramètre de requête API SABnzbd vers l'URL configurée.

La clé est configurée dans Homebridge UI comme champ mot de passe et n'est jamais écrite dans les logs du plugin.

### Configuration Homebridge UI

Le plugin fournit un fichier `config.schema.json`, ce qui permet à Homebridge UI d'afficher le formulaire de configuration sans interface personnalisée.

Sections :

- Connexion : nom de l'accessoire, URL SABnzbd, clé API, timeout HTTP, fréquence de rafraichissement.
- Commandes : durée de pause temporaire, limite de vitesse prédéfinie, fenêtre des échecs récents, interrupteur optionnel d'effacement des avertissements.

La documentation détaillée des options de configuration est disponible dans le wiki du dépôt.

### Compatibilite Avec Les Plugins Scopes Homebridge

Les plugins scopés Homebridge utilisent l'organisation npm `@homebridge-plugins/`. Un futur paquet scopé pour ce plugin s'appellerait donc :

```text
@homebridge-plugins/homebridge-sabnzbd
```

Seule l'équipe de collaborateurs Homebridge peut publier initialement des paquets sous ce scope. Le paquet public actuel reste :

```text
homebridge-sabnzbd
```

Le plugin conserve un namespace UUID HomeKit stable qui ne dépend pas du fait que le paquet npm soit scopé ou non. L'objectif est de permettre une future migration scoped sans recréer les accessoires HomeKit, pièces, scènes et automatisations, à condition de suivre la procédure de migration Homebridge.

### Exemple De Configuration

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

### Exemples D'automatisation Apple Maison

Mettre SABnzbd en pause pendant un appel vidéo :

1. Une scène ou automatisation HomeKit active l'interrupteur principal `SABnzbd`.
2. Homebridge envoie `mode=pause` à SABnzbd.
3. La file reste en pause jusqu'à ce que l'interrupteur soit désactivé.

Ralentir temporairement les téléchargements le soir :

1. Une automatisation Apple Maison programmée active `Speed Limit`.
2. Le plugin applique le pourcentage configuré, par exemple `50%`.
3. Une autre automatisation active `Normal Speed` plus tard.

Surveiller les échecs :

1. Le plugin interroge l'historique SABnzbd.
2. Si le dernier téléchargement a échoué, `Last Download Failed` est déclenché.
3. Les automatisations Maison peuvent utiliser ce capteur pour vous avertir via des canaux compatibles HomeKit.

### Rafraichissement Et Etat

Le plugin rafraichit l'état SABnzbd à intervalle fixe et après les commandes HomeKit. Chaque rafraichissement combine :

- `mode=queue`
- `mode=history`
- `mode=status`

Les pertes de connexion temporaires, timeouts, erreurs d'authentification et erreurs API sont journalisés clairement. Le plugin continue de fonctionner et réessaie au rafraichissement suivant.

### TODO

- Ajouter des services d'état optionnels plus riches si HomeKit propose de meilleurs mappings natifs.
- Ajouter des tests d'intégration contre des fixtures API SABnzbd enregistrées.
- Ajouter une documentation de caractéristiques personnalisées optionnelles pour les utilisateurs Homebridge UI.
- Ajouter des captures d'écran après test dans une vraie configuration Apple Maison.

### Depannage

`SABnzbd URL is required` : configurez l'URL de base SABnzbd complète, par exemple `http://sabnzbd.example:8080`.

`SABnzbd API key is required` : copiez la clé API depuis SABnzbd **Config > General > Security**.

`SABnzbd returned HTTP 403` ou erreurs d'authentification : vérifiez la clé API et assurez-vous qu'il n'y a pas d'espace en trop.

Timeout ou instance inaccessible : vérifiez que Homebridge peut joindre SABnzbd sur l'hôte, le protocole et le port configurés.

Aucune valeur ne se met à jour dans Apple Maison : vérifiez d'abord les logs Homebridge, puis réduisez `refreshIntervalSeconds` seulement après avoir confirmé que l'API est joignable.

### Securite

- Aucun service cloud n'est utilisé.
- Aucune télémétrie n'est incluse.
- Le plugin communique uniquement avec l'URL SABnzbd configurée.
- Seules les URL `http` et `https` sont acceptées.
- Les clés API ne sont jamais écrites dans les logs.
- Les actions destructrices SABnzbd ne sont pas implémentées.
- La validation TLS n'est pas désactivée globalement.
- Le polling est borné par `refreshIntervalSeconds` et `timeoutMs`.

### Developpement

```sh
npm install
npm run lint
npm run build
npm test
npm_config_cache=/private/tmp/homebridge-sabnzbd-npm-cache npm pack --dry-run
```

Les tests simulent l'API SABnzbd et ne nécessitent pas d'instance réelle.

### Publication

La publication est automatisée via GitHub Actions et npm Trusted Publishing. Aucun token npm n'est requis ou configuré dans GitHub.

Avant la première publication automatisée, configurez le Trusted Publisher du paquet npm :

- Organization or user : `deadbone`
- Repository : `homebridge-sabnzbd`
- Workflow filename : `publish.yml`
- Allowed actions : `npm publish`
- Environment name : laisser vide

Checklist de release :

1. Vérifier les métadonnées repository, bugs, homepage, author et license.
2. Mettre à jour la version dans `package.json` et `CHANGELOG.md`.
3. Exécuter `npm run lint`, `npm run build`, `npm test` et `npm pack --dry-run`.
4. Committer les changements de release.
5. Créer et pousser un tag correspondant, par exemple `git tag v0.1.0 && git push origin v0.1.0`.
6. Créer la GitHub Release après publication du paquet par le workflow.

Le workflow de publication s'exécute uniquement pour les tags `v*`. Il installe Node.js 24.x et la dernière version de npm, lance `npm ci`, vérifie que le tag correspond exactement à `v${package.json.version}`, exécute lint, build, tests et `npm pack --dry-run`, puis publie avec `npm publish` via npm Trusted Publishing.

Pour un futur paquet scopé, utiliser `npm publish --access=public` dans le workflow lors de la première publication scopée.
