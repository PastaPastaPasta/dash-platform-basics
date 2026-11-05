# Basics retirement pages

The 2025 unverified Platform demo has retired. Each existing URL explains why and offers its equivalent Explorer view without automatically redirecting:

| Bookmark | Explorer destination |
| --- | --- |
| `/` | `/` |
| `/get-identities/` | `/dpns/search` |
| `/all-dpns/` | `/dpns` |

All three pages use the same static layout, family shell, tokens and self-hosted Archivo font. The legacy SDK, RPC access and third-party script are removed. The pages make no data requests.

`family-links.js` is a small first-party adapter that resolves the destination through `dashhq.href()` for production, the local lab and network-carrying links. It can be removed when the shell supports declarative family links. This is the only page script besides the unchanged shell. See `SHELL.md` for the shell version and checksum.

Local checks: `node --check family-links.js` and the static copy build. There is no package-managed test, lint or typecheck suite. In the family lab, use `../../lab/build.sh basics` and check all three bookmarks at phone and desktop widths, in both themes.
