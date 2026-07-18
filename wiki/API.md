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

Le plugin utilise l'API HTTP JSON officielle de SABnzbd avec `output=json`.

## Polling

Chaque rafraichissement combine :

- `mode=queue`
- `mode=history`
- `mode=status`

Le résultat est normalisé dans un snapshot HomeKit unique.

## Commandes

- `mode=pause`
- `mode=resume`
- `mode=config&name=set_pause&value=<minutes>`
- `mode=config&name=speedlimit&value=<percent>`
- `mode=warnings&name=clear`, uniquement lorsque `clearWarningsEnabled` vaut `true`

## Non Implémenté

Le plugin n'appelle pas les actions destructrices SABnzbd :

- supprimer un téléchargement ;
- purger la file ;
- effacer l'historique ;
- arrêter SABnzbd ;
- redémarrer SABnzbd.
