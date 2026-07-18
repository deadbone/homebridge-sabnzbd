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

HomeKit ne fournit pas de type de service SABnzbd natif. Le plugin mappe donc l'état SABnzbd vers des services HomeKit supportés.

| Service HomeKit | Signification |
| --- | --- |
| Interrupteur principal | `On` met la file en pause, `Off` reprend la file. |
| Interrupteur `Temporary Pause` | Action momentanée qui applique `temporaryPauseMinutes`. |
| Interrupteur `Speed Limit` | Action momentanée qui applique `speedLimitPercent`. |
| Interrupteur `Normal Speed` | Action momentanée qui restaure `100%`. |
| Interrupteur `Refresh` | Rafraichissement manuel momentané. |
| Interrupteur `Clear Warnings` | Action momentanée optionnelle, désactivée par défaut. |
| Capteur d'occupation `Downloading` | Actif lorsqu'un élément de file est en téléchargement. |
| Capteur de contact `Queue` | Ouvert lorsque la file contient des éléments. |
| Capteur de fuite `Warnings` | Actif lorsque SABnzbd signale des avertissements. |
| Capteur de mouvement `Last Download Failed` | Actif lorsque le dernier élément d'historique est en échec. |
| Services numériques | Progression, vitesse, disque, nombre d'éléments, échecs récents. |

Les interrupteurs momentanés reviennent automatiquement sur `Off` après l'exécution de la commande.
