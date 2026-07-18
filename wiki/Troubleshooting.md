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

## URL Obligatoire

Configurez l'URL de base complète de SABnzbd :

```text
http://sabnzbd.example:8080
```

N'ajoutez pas `/api` ; le plugin l'ajoute automatiquement.

## Erreurs D'authentification

Vérifiez la clé API dans SABnzbd sous **Config > General > Security**. Assurez-vous qu'aucun espace n'a été copié au début ou à la fin.

## Timeout Ou Instance Injoignable

Vérifiez que Homebridge peut joindre SABnzbd sur l'hôte, le protocole et le port configurés.

## Les Valeurs Ne Se Mettent Pas À Jour

Consultez d'abord les logs Homebridge. Si l'API est joignable, vérifiez `refreshIntervalSeconds`.

## Impossible D'effacer Les Avertissements

L'interrupteur d'effacement des avertissements n'existe que lorsque `clearWarningsEnabled` vaut `true`.
