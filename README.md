# Basics retirement pages

The unverified 2025 demo has retired. Its jobs, looking up a username or an identity, now run in Radar Explorer
(explorer.dashhq.org), which checks Platform's proofs.

The root is a small lookup page: a username search (Radar `/names?q=<prefix>`) and an identity lookup
(Radar `/identity/<id>`), plus links to browse all names and all identities. Both forms are plain GET forms that work
without JavaScript; with it, a username loses a trailing `.dash` and an ID its spaces before the form goes. Everything
opens on Testnet unless the address names another network.

The old pages forward at once through the shared shell's `<dashhq-moved>`: `/get-identities/` opens Radar's
identities list and `/all-dpns/` its names list. An `id` parameter on any page opens its identity, and `name` opens
its username; the root then puts its `<dashhq-moved>` (kept in a `<template>`) in place. Query parameters, the
selected network and fragments travel with the bookmark, with `moved-from=basics` so Radar's bar can say what
happened. Unknown paths serve the same lookup page with absolute assets and a strict CSP.

Checks: `node --test retirement.test.mjs` and `node --check retirement.js`. There is
no package-managed lint or typecheck suite.
The shared footer identifies Basics without marking Explorer as the current page.
