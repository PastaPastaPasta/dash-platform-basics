# Basics retirement pages

The unverified 2025 demo has retired. Existing URLs explain the move to Explorer,
then continue after ten seconds. Visitors can choose Stay here to stop forwarding or use
the destination immediately. The shared shell owns this behaviour. The same header, copy structure, timing and controls
are used by the retired Vote and Fees pages.

The root opens Explorer; `/get-identities/` and `/all-dpns/` open username search.
An `id` parameter opens its identity, and `name` opens its username. All query
parameters, the selected network and fragments travel with the bookmark. Unknown
paths serve the same retirement page with absolute assets and a strict CSP.

Checks: `node --test retirement.test.mjs`, `node --check retirement.js`, and
`../../lab/build.sh basics`. There is no package-managed lint or typecheck suite.
The default network remains Testnet for legacy Basics bookmarks. The shared
footer identifies Basics without marking Explorer as the current page.
