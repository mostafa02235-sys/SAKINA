# Signing key

`sakina-release.jks` is the key that signs every SAKINA APK. Android only
installs an update over an existing app when both were signed with the same
key, so this file must stay the same for updates to keep working.

It is stored in the repository so the automatic build works with no setup.
Because the repository is public, the key is public too. That is acceptable
while SAKINA is shared as a direct APK download, but before publishing on
Google Play (or if you want only your builds to be installable as updates):

1. Create a new private key and keep it out of the repository.
2. Add it to the repository as GitHub secrets: `SAKINA_KEYSTORE_BASE64`
   (the file, base64-encoded), `SAKINA_KEYSTORE_PASSWORD`, `SAKINA_KEY_ALIAS`
   and `SAKINA_KEY_PASSWORD`. The build uses them automatically when present.
3. Delete this keystore. People who installed an older APK will need to
   uninstall it once before installing the newly signed one.
