# Development

## Commands

```sh
npm install
npm run lint
npm run build
npm test
npm_config_cache=/private/tmp/homebridge-sabnzbd-npm-cache npm pack --dry-run
```

## Architecture

- `src/index.ts`: Homebridge registration.
- `src/platform.ts`: dynamic platform lifecycle and polling.
- `src/sabnzbd-api.ts`: SABnzbd HTTP JSON API client.
- `src/accessories/sabnzbdAccessory.ts`: HomeKit service mapping.
- `src/settings.ts`: configuration normalization and validation.
- `src/models/`: typed SABnzbd response models.
- `test/`: unit tests with mocked API responses.

## Release Checklist

1. Update README and wiki pages for user-facing behavior.
2. Update `CHANGELOG.md`.
3. Run lint, build, tests and package dry-run.
4. Commit and push.
5. Create a GitHub Release before publishing to npm.

## Francais

## Commandes

```sh
npm install
npm run lint
npm run build
npm test
npm_config_cache=/private/tmp/homebridge-sabnzbd-npm-cache npm pack --dry-run
```

## Architecture

- `src/index.ts` : enregistrement Homebridge.
- `src/platform.ts` : cycle de vie de la plateforme dynamique et polling.
- `src/sabnzbd-api.ts` : client HTTP JSON SABnzbd.
- `src/accessories/sabnzbdAccessory.ts` : mapping des services HomeKit.
- `src/settings.ts` : normalisation et validation de configuration.
- `src/models/` : modèles typés des réponses SABnzbd.
- `test/` : tests unitaires avec réponses API simulées.

## Checklist De Release

1. Mettre à jour README et pages wiki pour tout comportement visible utilisateur.
2. Mettre à jour `CHANGELOG.md`.
3. Lancer lint, build, tests et package dry-run.
4. Commit et push.
5. Créer une GitHub Release avant toute publication npm.

Les tests simulent l'API SABnzbd et ne nécessitent pas d'instance réelle.
