# SABnzbd API Usage

The plugin uses the official SABnzbd HTTP JSON API with `output=json`.

## Polling

Each refresh combines:

- `mode=queue`
- `mode=history`
- `mode=status`

The result is normalized into one HomeKit snapshot.

## Commands

- `mode=pause`
- `mode=resume`
- `mode=config&name=set_pause&value=<minutes>`
- `mode=config&name=speedlimit&value=<percent>`
- `mode=warnings&name=clear`, only when `clearWarningsEnabled` is `true`

## Not Implemented

The plugin does not call destructive SABnzbd actions:

- delete a download;
- purge the queue;
- clear history;
- shut down SABnzbd;
- restart SABnzbd.

## Francais

Le plugin utilise `queue`, `history` et `status` pour construire l'état HomeKit. Les commandes implémentées sont limitées à la pause, reprise, pause temporaire, limite de vitesse, retour vitesse normale et effacement optionnel des avertissements.
