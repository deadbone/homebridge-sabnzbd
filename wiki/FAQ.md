# FAQ

## Does The Plugin Delete Downloads?

No. Destructive actions are intentionally not implemented.

## Why Are Numeric Values Not Native SABnzbd Tiles?

HomeKit does not provide a SABnzbd service type. The plugin uses supported HomeKit services so the accessory remains understandable in Apple Home.

## Can I Use HTTPS?

Yes, configure an `https://` URL. The plugin does not disable TLS validation globally.

## Can I Clear Warnings?

Yes, but only when `clearWarningsEnabled` is explicitly set to `true`.

## Francais

Le plugin ne supprime aucun téléchargement. HTTPS est possible avec une URL `https://`. L'effacement des avertissements est disponible uniquement si l'option est explicitement activée.
