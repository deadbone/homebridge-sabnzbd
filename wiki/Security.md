# Security

- No cloud service is used.
- No telemetry is included.
- The plugin talks only to the configured SABnzbd URL.
- Only `http` and `https` URLs are accepted.
- API keys are never logged.
- Destructive SABnzbd actions are not implemented.
- TLS validation is not disabled globally.
- Polling is bounded by configuration.

## Sensitive Data

Do not paste real API keys, private IP addresses, personal domains or credentials into issues. Use placeholders in examples.

## Francais

Le plugin n'utilise aucun cloud, n'ajoute aucune télémétrie et ne journalise pas la clé API. Les actions destructrices SABnzbd ne sont pas implémentées.
