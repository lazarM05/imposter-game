# Color System

A living reference for every color that carries a fixed meaning in this
app, plus how the per-mode theme system works. Unlike the dated design
docs in this folder, this one isn't a point-in-time proposal — edit it in
place whenever colors are added, reassigned, or retired. Treat it as the
answer to "can I use this color for X?" before hardcoding anything new.

---

## Mode Theme System

Each game mode has one brand color, set once and read everywhere via CSS
custom properties — see `CLAUDE.md` for the wider architecture, this is
just the color piece.

**How it works:** `selectMode(m)` sets `document.body.dataset.mode = m`.
CSS then defines the palette for that mode:

```css
body[data-mode="imposter"]{--mode-color:var(--accent);--mode-color-rgb:232,68,90;--mode-oncolor:#fff}
body[data-mode="cuckoo"]{--mode-color:var(--teal);--mode-color-rgb:45,212,191;--mode-oncolor:#0a0a10}
body[data-mode="reverse"]{--mode-color:var(--yellow);--mode-color-rgb:251,191,36;--mode-oncolor:#0a0a10}
```

Any widget that should reflect "this game's brand color" reads
`var(--mode-color)` / `var(--mode-color-rgb)` / `var(--mode-oncolor)`
directly — it never needs a mode-specific CSS class or a JS
`if (mode === ...)` branch. `--mode-oncolor` is the text color to use on
top of a solid `--mode-color` fill (white on red, dark on teal/yellow —
pick based on contrast when adding a mode).

**Current mode themes:**

| Mode (internal key) | Display name | Color |
|---|---|---|
| `imposter` | Standard | Red (`--accent`) |
| `cuckoo` | Cuckoo | Teal (`--teal`) |
| `reverse` | Reverse | Yellow (`--yellow`) |

**Adding a new mode:** pick an unused color (see reserved list below —
don't reuse `--err` or `--lime`, they're spoken for), add one
`body[data-mode="x"]{...}` block, and add a card to the Home screen's
`.mode-grid` (which is the one place that can't use `--mode-color`, since
all mode cards are visible at once with no "current mode" yet — those
stay individually hardcoded per card, by design).

**Widgets currently driven by `--mode-color`:** mode label (`.gml`),
all `.btn-p` buttons, player avatars (`.p-av`/`.gp-av`), the selected-vote
card outline + "SELECTED" badge, the reveal-panel border, category filter
chips (`.cat-chip.active`), the status bar's imposter/cuckoo-count stat,
and (see below) the Game Over title when players win.

---

## Reserved Colors (fixed meaning, do not repurpose for a mode theme)

| Meaning | Color | Where it shows up |
|---|---|---|
| "This player is the Impostor" (role badge) | Red (`--accent`) | Peek badge, Game Over role-reveal badge |
| "This player is the Cuckoo" (role badge) | Teal (`--teal`) | Peek badge, Game Over role-reveal badge |
| **Antagonists won** (imposter/cuckoo side) | Red (`--accent`) — always, regardless of which mode | Game Over title (`imposter_wins`, `imposter_guessed`, `cuckoo_wins`, `imposter_win_cycle`, `imposter_win_guesses`) |
| **Players/team won** | The active mode's `--mode-color` | Game Over title (`players_win`, `players_win_vote`, `players_win_guess`) |
| Destructive/irreversible action armed | Red (`--accent`) | "Confirm Elimination" once a target is selected, "Imposter Guessed The Word" |
| Invalid input / something's wrong | `--err` (a separate bright red, distinct from `--accent`) | Count-cap errors, blocked-toggle errors, wrong-guess error |
| "Live" data indicator (the Live Remaining Counts toggle — unrelated to game mode) | Lime (`--lime`) | Stat box border/label when that toggle is on |
| Neutral info tag | Purple (`--purple`) | The "Category" stat, shown in every mode |
| Tied vote (no one eliminated) | Yellow (`--yellow`) | Game Over title, neutral outcome |
| No result / fallback | Purple (`--purple`) | Game Over title, edge-case fallback |

**Rule of thumb:** role colors and win/loss colors answer "who did what,"
not "which mode is this" — they stay fixed across every mode on purpose,
even when a mode's own brand color happens to match. A returning player
should be able to trust "red badge = the deceiver" and "red title = the
bad guys won" no matter which of the three modes they're in.

---

## Known Coincidental Collisions (expected, not bugs)

As more modes get added, a mode's brand color will sometimes match a
reserved color by coincidence. That's fine and doesn't need fixing on
its own — only fix it if it actually causes confusion in practice.
Currently known:

- **Standard mode's brand color is red**, which is also the fixed
  "antagonists won" / "impostor role" color. So Standard mode's own loss
  screen and its own brand color are visually identical — coincidental,
  not a bug.
- **Reverse mode's brand color is yellow**, which is also the default
  color for a "regular word" display (`.pk-word`, `.reveal-word` — predates
  Reverse mode). In Reverse mode screens, hint text and the mode's brand
  color are now the same yellow. Reads as thematically consistent rather
  than confusing, left as-is.
- **Cycle-progress dots** (`.cdot.done` = red, `.cdot.current` = yellow)
  aren't mode-themed — they're a fixed progress indicator. In Reverse
  mode, the "current cycle" dot (yellow) blends into the rest of a
  yellow-themed screen. Noted here in case it ever becomes a real
  readability complaint worth revisiting; not changed for now.
