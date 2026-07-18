# API

Le plugin utilise l'API HTTP JSON officielle de SABnzbd :

- `mode=queue`
- `mode=history`
- `mode=status`
- `mode=pause`
- `mode=resume`
- `mode=config&name=set_pause`
- `mode=config&name=speedlimit`
- `mode=warnings&name=clear`, uniquement si activé.

Les appels destructeurs ne sont pas implémentés.
