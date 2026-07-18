![banniere homebridge-sabnzbd](branding/banner-sabnzbd.png)

# homebridge-sabnzbd

Plugin de plateforme dynamique Homebridge permettant de superviser et piloter une instance SABnzbd depuis Apple Maison.

> Version initiale : ce plugin est actuellement en `0.1.0`.

> Note de sécurité : les actions destructrices SABnzbd ne sont volontairement pas implémentées. Le plugin ne peut pas supprimer de téléchargements, purger la file, effacer l'historique, arrêter SABnzbd ou redémarrer SABnzbd.

## Compatibilite

- Homebridge : `^2.0.0`
- Node.js : `^22 || ^24`
- SABnzbd : API stable 5.x, développé contre SABnzbd 5.0.4
- Type de plugin : plateforme dynamique
- Format de module : ESM

## Installation

### Homebridge UI

Une fois le paquet publié sur npm, installez-le depuis Homebridge UI :

1. Ouvrez Homebridge UI.
2. Allez dans **Plugins**.
3. Recherchez `homebridge-sabnzbd`.
4. Cliquez sur **Install**.
5. Redémarrez Homebridge.

### npm

```sh
npm install -g homebridge-sabnzbd
```

### Installation Locale De Developpement

```sh
npm install
npm run build
npm link
```

## Configuration

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

La clé API SABnzbd est disponible dans **Config > General > Security**. Elle est configurée comme champ mot de passe dans Homebridge UI et n'est jamais écrite dans les logs.

## Services HomeKit

- Interrupteur principal : pause ou reprise de la file.
- `Temporary Pause` : pause temporaire configurée.
- `Speed Limit` : limite de vitesse prédéfinie.
- `Normal Speed` : retour à `100%`.
- `Refresh` : rafraichissement manuel.
- `Clear Warnings` : optionnel, seulement si activé.
- Capteurs : téléchargement actif, file non vide, avertissements, dernier téléchargement en erreur.
- Valeurs numériques : progression, vitesse, disque libre, nombre d'éléments, échecs récents.

## Securite

- Aucun service cloud.
- Aucune télémétrie.
- Communication uniquement avec l'URL SABnzbd configurée.
- Clé API jamais journalisée.
- Aucune action destructrice SABnzbd.
- Validation TLS conservée.

## Documentation Detaillee

Le README principal contient la documentation bilingue complète. Le dossier `wiki/` contient les pages détaillées destinées au GitHub Wiki.
