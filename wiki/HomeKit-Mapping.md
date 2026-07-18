# HomeKit Mapping

HomeKit has no native SABnzbd service type, so the plugin maps SABnzbd state to supported HomeKit services.

| HomeKit Service | Meaning |
| --- | --- |
| Main switch | `On` pauses the queue, `Off` resumes it. |
| `Temporary Pause` switch | Momentary action applying `temporaryPauseMinutes`. |
| `Speed Limit` switch | Momentary action applying `speedLimitPercent`. |
| `Normal Speed` switch | Momentary action restoring `100%`. |
| `Refresh` switch | Momentary manual refresh. |
| `Clear Warnings` switch | Optional momentary action, disabled by default. |
| `Downloading` occupancy sensor | Active when a queue slot is downloading. |
| `Queue` contact sensor | Open when queue items exist. |
| `Warnings` leak sensor | Active when SABnzbd reports warnings. |
| `Last Download Failed` motion sensor | Active when the latest history item failed. |
| Numeric services | Progress, speed, disk, queue count, recent failures. |

Momentary switches automatically return to `Off` after the command runs.

## Francais

HomeKit ne fournit pas de type SABnzbd natif. Le plugin utilise donc des services standards : interrupteurs, capteurs et services numériques. Les interrupteurs de commande sont momentanés sauf l'interrupteur principal de pause/reprise.
