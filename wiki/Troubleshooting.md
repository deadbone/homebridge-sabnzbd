# Troubleshooting

## URL Required

Configure the full SABnzbd base URL:

```text
http://sabnzbd.example:8080
```

Do not include `/api`; the plugin adds it automatically.

## Authentication Errors

Verify the API key in SABnzbd under **Config > General > Security**. Make sure there are no copied spaces.

## Timeout Or Unreachable

Check that Homebridge can reach SABnzbd on the configured host, protocol and port.

## Values Do Not Update

Check Homebridge logs first. If the API is reachable, verify `refreshIntervalSeconds`.

## Warnings Cannot Be Cleared

The clear warnings switch exists only when `clearWarningsEnabled` is set to `true`.

## Francais

Vérifiez l'URL, la clé API, la connectivité entre Homebridge et SABnzbd, puis les logs Homebridge. L'URL ne doit pas inclure `/api`.
