# TODO

## Ongoing Tasks

### PWA / Play Store path
- **PWA manifest + service worker** — wire up `vite-plugin-pwa` in `vite.config.js` (currently installed, not configured) with the game's name/colors/icons; generate real icon assets (192/512/maskable PNGs — no art exists yet); verify Lighthouse PWA score ≥ 80.
- **Play Store packaging** — once the PWA is hosted on HTTPS, use Bubblewrap or PWABuilder to generate the signed `.aab`. Needs local Android SDK/Java (do this in Claude Code locally, not a sandbox), the $25 Play Console developer fee, and Digital Asset Links domain verification. Treat as a "stop and confirm" category per `CLAUDE.md`'s Iteration Mode.

### Game modes
- **Hint Trail mode** — third mode spec'd in `docs/Imposter-Cuckoo_HintTrail_GameMode.md`, not built yet. Per that doc's own note: build as a `src/modes/` structure only once a third mode makes `game.js` unwieldy (currently handles Imposter + Cuckoo fine as-is — YAGNI until then).

### Content & Balance
- **Award categories overhaul** — current word categories feel lacking; need to be more engaging for better gameplay. Explicitly deferred as lowest priority during the 2026-07-11/12 gameplay revamp — see `docs/superpowers/specs/2026-07-11-gameplay-ux-revamp-design.md` for context.

## Completed Tasks

### 2026-07-11/12 — Standard mode rule fixes, multi-imposter/cuckoo support, UX cleanup
Fixed Standard mode's win-loop (was single-vote-ends-game by design; now loops cycles until the Imposter is caught or reaches parity with remaining players). Merged the vote-flow UI in both modes into one panel — no more separate "vote to vote?" (Standard) or "Start Vote" (Cuckoo) step before cards become clickable. Added a live remaining-counts toggle (Setup screen, both modes). Generalized both modes to a configurable Imposter/Cuckoo count — Auto (1:3 ratio) or manual entry capped at that same ratio, via a shared `impCountCap()` pattern in `ui.js`; this also surfaced and fixed a matching `maxCycles` undercounting bug in **both** modes (was using a cosmetic formula instead of the actual parity math). Added a "Word Guessed" instant-win button for Standard mode. Removed Cuckoo mode's "Tell Cuckoos they are Cuckoos" toggle — blind mode is now permanent, non-configurable. Renamed Imposter mode's display name to "Standard" (internal `mode` key/CSS classes unchanged — see `CLAUDE.md` Key Patterns). Fixed several player-list UX issues: select-all-on-focus for renaming, new players now insert at the top of the list (Add Player button moved above it), and a 3-player minimum is enforced. Test suite grew from 16 to 28 tests, all in `game.js`'s coverage. Full design rationale in `docs/superpowers/specs/2026-07-11-gameplay-ux-revamp-design.md`.

### 2026-07-11 — Vite scaffold migration
Split the single-file `cuckoo-game.html` prototype into a proper Vite project (`src/words.js`, `utils.js`, `game.js`, `ui.js`, `main.js`, `style.css` + `index.html`), added Vitest unit tests for the pure logic modules (16 tests passing), verified both Imposter and Cuckoo mode flows end-to-end in a browser against the original prototype. Installed Node.js (wasn't present on this machine). Set up `CLAUDE.md` and this file via the standard project-install interview.

## Discussion Topics

- No fixed "always ask before X" list yet beyond what's in `CLAUDE.md` — add items here as they come up, then promote settled ones into `CLAUDE.md`'s Iteration Mode section.
