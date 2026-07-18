# homebridge-sabnzbd Wiki

`homebridge-sabnzbd` is a Homebridge dynamic platform plugin for monitoring and controlling SABnzbd from Apple Home.

## Start Here

- [Installation](Installation.md)
- [Configuration](Configuration.md)
- [HomeKit Mapping](HomeKit-Mapping.md)
- [SABnzbd API Usage](API.md)
- [Troubleshooting](Troubleshooting.md)
- [Security](Security.md)
- [Development](Development.md)
- [FAQ](FAQ.md)
- [Contribution](Contribution.md)
- [Changelog](Changelog.md)

## Scope

The plugin focuses on safe monitoring and non-destructive control:

- pause and resume the queue;
- apply a temporary pause;
- apply or reset a speed limit;
- refresh status manually;
- optionally clear warnings when explicitly enabled;
- expose SABnzbd status through supported HomeKit services.

Actions such as deleting downloads, purging the queue, clearing history, shutting down SABnzbd, or restarting SABnzbd are not implemented.

## Francais

`homebridge-sabnzbd` est un plugin de plateforme dynamique Homebridge pour superviser et piloter SABnzbd depuis Apple Maison.

Le plugin se limite aux commandes non destructrices : pause, reprise, pause temporaire, limite de vitesse, retour vitesse normale, rafraichissement manuel et effacement optionnel des avertissements.
