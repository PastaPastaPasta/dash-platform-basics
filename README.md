# Basics retirement pages

The unverified 2025 demo has retired. Existing URLs forward at once to Explorer,
where the bar says that basics.dashhq.org is now part of it. The shared shell's
`<dashhq-moved>` owns this behaviour, the same on the retired Vote and Fees pages.
Without JavaScript each page shows one link to its replacement.

The root opens Explorer; `/get-identities/` and `/all-dpns/` open username search.
An `id` parameter opens its identity, and `name` opens its username. All query
parameters, the selected network and fragments travel with the bookmark. Unknown
paths serve the same retirement page with absolute assets and a strict CSP.

Checks: `node --test retirement.test.mjs`, `node --check retirement.js`, and
`../../lab/build.sh basics`. There is no package-managed lint or typecheck suite.
The default network remains Testnet for legacy Basics bookmarks. The shared
footer identifies Basics without marking Explorer as the current page.
