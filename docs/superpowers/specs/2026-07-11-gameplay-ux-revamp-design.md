# Gameplay & UX Revamp — Design

**Status:** Approved, pending implementation plan
**Date:** 2026-07-11

## Context

A round of manual playtesting turned up one rule bug and several UX friction points across the setup, peek, and game screens. This spec covers everything in scope for the next implementation pass, in priority order. Two items were raised but are explicitly **out of scope** here — see "Deferred" at the end.

## 1. Standard mode win-loop fix (`game.js`)

**Current behavior:** `checkEnd()` for `mode === 'imposter'` has no `'continue'` branch — every single elimination vote ends the game (catch the Imposter → `players_win`, miss → `imposter_wins`). This matches the home screen's current copy ("One chance to vote — majority decides") but is not what's wanted going forward. This is a rule change, not a bug fix — the existing code does exactly what it was written to do.

**New behavior:** Mirror Cuckoo's loop, with exactly 1 imposter (this count is not becoming configurable in this pass):
- Each cycle, the group may eliminate one player or skip (skip is unique to Standard — see §2).
- If the eliminated player is the Imposter → `players_win`.
- Otherwise, count remaining non-imposter players. If that count is `<= 1` (i.e. equal to the imposter count) → `imposter_wins`.
- Otherwise → `'continue'`: increment `G.cycle`, stay in `phase: 'play'`.

This makes `checkEnd` symmetric between modes, which lets `confirmElimination()` in `ui.js` drop its per-mode branching:

```js
export function confirmElimination() {
  if (selectedVoteIdx === null) return;
  G.players[selectedVoteIdx].eliminated = true;
  G.phase = 'play';
  const result = checkEnd(G);
  if (result === 'continue') {
    G.cycle++;
    renderGame();
  } else {
    triggerFinalReveal(result);
  }
}
```

**Cycle bar:** Standard mode currently hides the cycle-progress dots (`renderCycleBar` returns early for `mode === 'imposter'`). Since Standard is no longer single-shot, it gets the same cycle bar Cuckoo has. `buildGameData` needs an analogous `maxCycles` for Standard, computed the same way as Cuckoo's (`stopAt = imposter count = 1`, `maxCycles = n - stopAt`), for display purposes only — it does not gate anything, matching how Cuckoo's `maxCycles` is cosmetic today.

**Removed:** The "Tied Vote — No Elimination" button/handler (`confirmTiedVote`) and the `'tied'` end-result path are deleted. Ties are handled by Skip (Standard) or simply not confirming (Cuckoo) — see §2.

## 2. Merge vote flow (both modes)

**Current behavior:** Two sequential phases per cycle. Standard: a "vote to vote?" panel (`meta-vote-panel`, Yes/Skip + Confirm) must be resolved before the elimination-selection panel (`vote-panel`) appears. Cuckoo: a "Start Vote" button (`ready-vote-panel`) must be tapped before the same elimination-selection panel appears. Player cards show a locked "🔒 Hidden" state until the pre-vote step is cleared.

**New behavior:** Delete `meta-vote-panel` and `ready-vote-panel` from `index.html` entirely. Only `vote-panel` remains, shown for the whole `phase: 'play'` duration of a cycle (there is no more separate `'vote'` phase value — `G.phase` is just `'play'` or `'reveal'`).

- Cards are clickable the instant a cycle starts — no locked state. Tapping a card selects it (existing `selectVote`/`selectedVoteIdx` behavior, unchanged).
- **Confirm** button is present in the panel but only enabled/shown once a card is selected (reuses the existing `.vote-confirm-btn.ready` pattern).
- **Skip** button: present only in Standard mode. Tapping it increments `G.cycle` and re-renders in `play` phase, no elimination — same effect as today's meta-panel "Skip". Not present in Cuckoo mode, since Cuckoo's vote stays mandatory each cycle (unchanged rule).
- The "Tied Vote" button is removed (see §1) — a tied show-of-hands in Standard is just Skip; in Cuckoo there's no equivalent, the group simply keeps talking until a majority forms and someone confirms a selection.

`renderCards()`'s `isVoting` check becomes simply `G.phase === 'play'` (true for the whole cycle, not just a sub-phase). `renderPhaseUI()` collapses to one branch that shows `vote-panel` and toggles the Skip button's visibility by mode.

## 3. Live remaining-counts toggle

**New Setup option** (in the existing `options-list`, one `addToggle()` call), applies to both modes, **default off**:

> "Show Live Remaining Counts — Player/Imposter (or Cuckoo) counts update each cycle instead of showing only the starting numbers"

Read into `opts.liveStats` in `goToPeek()`, same pattern as the other options.

**`renderStatus()` behavior:**
- **Off (default):** the top panel shows the game's starting snapshot only, frozen for the whole game — "Players: 5", "Imposters: 1" (Standard) or "Cuckoos: 2" (Cuckoo) — plus a small "AT THE START" label so it's clear these numbers don't move. Note this is a slight behavior change from today's code: the "Active"/"Players" stat currently already live-updates unconditionally (nobody noticed because the Standard-mode bug meant the game always ended after the first vote, before a decrement was ever visible). Under this spec, live-updating becomes opt-in for *both* stats in *both* modes.
- **On:** the same slots read "Players: 4/5", "Imposters: 1/1" (Standard) or "Cuckoos: 1/2" (Cuckoo), recomputed live each render, labeled "LIVE".
- Standard mode's stat label is renamed from "Active" to "Players" so both modes read consistently.

**Spoiler trade-off (intentional):** Cuckoo's cuckoo-count is deliberately frozen in the current code specifically so eliminations don't reveal whether the eliminated player was a Cuckoo. Turning this toggle on is an explicit opt-in by the group to give up that protection. This is a deliberate trade-off being offered, not an oversight.

## 4. Name-edit select-all

In `renderPlayers()`, the player-name `<input>` gets `onfocus="this.select()"` (or equivalent). Tapping/focusing the field selects the entire current value, so typing a real name immediately replaces the "Player N" placeholder instead of requiring manual deletion.

## 5. Home menu rename + title

- Mode card: "Imposter" → **"Standard"** (display label only — the internal `mode` value stays the string `'imposter'` everywhere in `ui.js`/`game.js`, and CSS classes like `.mi`, `.wi`, `.gml.imposter` are untouched, to avoid unrelated churn). "Cuckoo" stays "Cuckoo" — no rename.
- Standard's mode-card description needs to change regardless of naming, since it's no longer accurate after §1: current text "One player gets no word. One chance to vote — majority decides." becomes **"One player gets no word. Vote each cycle to catch them before they outlast you."**
- Home title: replace the stacked "IMPOSTER" / "CUCKOO" lines with stacked **"IMPOSTER"** (existing `.wi`, red/`--accent`) / **"GAMES"** (existing `.wc`, teal/`--teal`) — reusing current color classes, no new CSS needed. The `<p class="tagline">Two games. One bluffer.</p>` line is removed entirely, nothing replaces it.

## Deferred (explicitly out of scope for this pass)

- **Award-categories overhaul** — current categories are lacking/need to be more engaging. Lowest priority, revisit later as its own design.
- **"Word Guessed" instant-win button** — a button (bottom corner of the game screen, Standard mode) that a player taps when the group has verbally confirmed the Imposter guessed the secret word correctly, jumping straight to the reveal/results screen with the Imposter as winner. Noted for a future spec; not designed or built in this pass.

## Files touched

- `src/game.js` — `checkEnd`, `buildGameData` (Standard mode: continue branch, `maxCycles`)
- `src/ui.js` — `confirmElimination`, `renderPhaseUI`, `renderCards`, `renderStatus`, `renderCycleBar`, `goToPeek` (read new toggle), `renderPlayers` (select-all), remove `selectMeta`/`confirmMeta`/`startEliminationVote`/`confirmTiedVote`
- `index.html` — remove `meta-vote-panel`/`ready-vote-panel`, adjust `vote-panel`, home screen title/tagline/mode-card copy, new Setup toggle
- `src/style.css` — likely minimal/no changes (reusing existing classes); confirm during implementation
- `src/game.test.js` — needs new/updated cases for Standard mode's `checkEnd` continue/win branches (this is the one module with real test coverage — must stay green)
