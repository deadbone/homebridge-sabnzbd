# API

The plugin uses the official SABnzbd HTTP JSON API:

- `mode=queue`
- `mode=history`
- `mode=status`
- `mode=pause`
- `mode=resume`
- `mode=config&name=set_pause`
- `mode=config&name=speedlimit`
- `mode=warnings&name=clear`, only when enabled.

Destructive API calls are not implemented.
