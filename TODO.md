# TODO

## Ongoing Tasks

### PWA / Play Store path
- **PWA manifest + service worker** — wire up `vite-plugin-pwa` in `vite.config.js` (currently installed, not configured) with the game's name/colors/icons; generate real icon assets (192/512/maskable PNGs — no art exists yet); verify Lighthouse PWA score ≥ 80.
- **Play Store packaging** — once the PWA is hosted on HTTPS, use Bubblewrap or PWABuilder to generate the signed `.aab`. Needs local Android SDK/Java (do this in Claude Code locally, not a sandbox), the $25 Play Console developer fee, and Digital Asset Links domain verification. Treat as a "stop and confirm" category per `CLAUDE.md`'s Iteration Mode.

### Game modes
- **Hint Trail mode** — third mode spec'd in `docs/Imposter-Cuckoo_HintTrail_GameMode.md`, not built yet. Per that doc's own note: build as a `src/modes/` structure only once a third mode makes `game.js` unwieldy (currently handles Imposter + Cuckoo fine as-is — YAGNI until then).

## Completed Tasks

### 2026-07-11 — Vite scaffold migration
Split the single-file `cuckoo-game.html` prototype into a proper Vite project (`src/words.js`, `utils.js`, `game.js`, `ui.js`, `main.js`, `style.css` + `index.html`), added Vitest unit tests for the pure logic modules (16 tests passing), verified both Imposter and Cuckoo mode flows end-to-end in a browser against the original prototype. Installed Node.js (wasn't present on this machine). Set up `CLAUDE.md` and this file via the standard project-install interview.

## Discussion Topics

- No fixed "always ask before X" list yet beyond what's in `CLAUDE.md` — add items here as they come up, then promote settled ones into `CLAUDE.md`'s Iteration Mode section.
