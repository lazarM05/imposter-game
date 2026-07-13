# Imposter/Cuckoo — "Reverse" Game Mode (Hint Trail Redesign)
### Design Document

Supersedes `docs/Imposter-Cuckoo_HintTrail_GameMode.md` (see that file's own
header for the supersession note) and folds in
`docs/2026-07-12-hint-trail-redesign-notes.md`, the running session notes
this spec was compiled from. This is the current source of truth for the
mode's design, but it is **not fully locked** — see Open Questions at the
end.

**Display name: "Reverse"** — chosen because everyone's usual role is
flipped (impostors know the word instead of not knowing it; the team's
job is to find the word instead of finding the impostor first). Following
this project's existing convention (see `CLAUDE.md`'s note on "Standard"
mode), the display name and the internal mode key don't have to match —
the internal key is a later implementation decision, not fixed here.

---

## Concept Summary

A cooperative-deduction mode built around information asymmetry. The
**impostors know the actual secret word** — the same word the rest of the
team is trying to guess. Their job is to keep the team from landing on it,
by inventing a plausible-sounding but misleading hint each cycle. This is a
flip from the original "Hint Trail" concept, where impostors were given a
separate fake word and didn't know the real one either.

---

## Core Setup

- **Secret Word**: Chosen at game start.
- **Impostors know the secret word.** This is the central mechanic change
  from the original spec — impostors are no longer kept in the dark with a
  fake word; they know exactly what the team is trying to guess.
- **Non-impostor players are split into hint-variety groups each cycle**
  (see Hint Variety Mechanic below) rather than each getting a unique hint
  — this replaces the original spec's "one unique hint per non-impostor"
  mechanic and is the fix for the hint-content scaling problem.
- **Impostor Task**: Each cycle, every impostor either (a) invents their
  own misleading hint and shares it as if genuine, matching their story
  with other impostors if there's more than one, or (b) repeats one of the
  real hints verbatim to blend in — trading away their chance to actively
  steer the group away from the word in exchange for not standing out.
  This is a live table-talk choice, not something the app assigns.

---

## Impostor Ratio

Unchanged from the original spec — roughly 1:3, one impostor per 3 players.

| Player Count | Impostors |
|---|---|
| 5 | 1 |
| 6 | 2 |
| 9 | 3 |

---

## Hint Variety Mechanic (replaces old per-player unique hint)

Instead of every non-impostor getting their own unique hint each cycle
(which was the source of the quadratic hint-content scaling problem), **all
players are split into 3 roughly-equal groups each cycle**:

1. The impostor group (sized per the existing 1:3 Impostor Ratio table
   above).
2. A non-impostor group that gets real hint #1.
3. A non-impostor group that gets real hint #2.

So the non-impostors (everyone not in group 1) are divided as evenly as
possible between the two remaining groups. **Real-hint variety is a flat
2, always** — it does not grow with player count, since it's always "2 of
the 3 groups," not a count derived from headcount. This is what keeps the
hint-content list small regardless of table size: content only ever needs
2 real hint texts per cycle, not one per non-impostor.

Worked examples given during design:
- **1 impostor, 2 non-impostors** (3 players total): 3 groups of ~1 each —
  1 impostor, 1 player on real hint #1, 1 player on real hint #2.
- **3 impostors, 6 non-impostors** (9 players total): 3 groups of 3 each —
  3 impostors, 3 players on real hint #1, 3 players on real hint #2.

Impostors then each individually choose to either invent their own fake
hint (coordinating their story with other impostors if there's more than
one) or repeat one of the 2 real hints verbatim to blend in — see Core
Setup above.

This turns "hints per word" from the original spec's
`(n − impCount) × cycles` into a flat `2 × cycles` — linear in cycle count
only, not in player count, and with cycles capped at `n` (see Cycle Limit
below) that bounds the total content needed per word regardless of table
size.

**Content authoring, for now**: hint content will be placeholder templates
("Hint 1", "Hint 2", "Hint 3", ...) rather than real curated hints. Writing
real hint content per word is deferred to later, once the mechanic itself
is validated.

---

## Round Structure (Cycles)

1. **Start of Cycle**: Each player privately views their hint for this
   cycle (real hint #1, real hint #2, or "you're an impostor, the word is
   X — invent a hint") — delivered via the same private, phone-passing
   reveal format the other two modes already use to show each player their
   word at game start, just repeated at the top of every cycle instead of
   only once at the start of the game.
2. **Hint Sharing**: All players share their hint word with the group out
   loud.
3. **Discussion**: Group discusses which hints feel "off" and who might be
   an impostor. Guessing the secret word and voting out a suspected
   impostor are both available at any point during this discussion (see
   Word-Guess Mechanic and Vote-Kick Mechanic below) — neither is tied to
   the cycle boundary.
4. **Cycle Advances**: A persistent "Next Cycle" button (bottom of screen)
   lets the team manually advance whenever they're done discussing.
   Pressing it triggers hint distribution for the new cycle (back to step
   1). Guessing and voting don't auto-advance the cycle — they're
   independent actions available any time, confirmed above.

## Cycle Limit

- **Fixed at `cycles = total player count`** (including impostors).
- This replaces the original spec's flat "3 cycles, configurable" default.
- Bounds both the total hint content needed per word (see Hint Variety
  Mechanic above) and how long the game can run before impostors win by
  default.

---

## Word-Guess Mechanic

- The team shares a **pool of 3 guess attempts at the secret word, total,
  for the whole game** (this brings back the original spec's "3 guesses"
  budget, replacing the earlier forced-guess-every-cycle idea).
- Guessing is available **any time**, not gated to a cycle boundary or any
  particular step — same "whenever" timing as the vote-kick mechanic.
  Making a guess doesn't pause or end the current cycle; discussion and
  cycle-advancement continue normally around it.
- A guess consumes one of the 3 attempts whether right or wrong. Exhausting
  all 3 without success ends the game as an impostor win (see Win
  Conditions below) — this is an immediate result, not something that
  waits for the cycle limit to also be reached.
- Because the guess is spoken aloud to the whole group, a wrong guess
  reveals the team's current theory to the impostors — who already know
  the real word — letting them steer future fake hints away from wherever
  the team's guess just landed. This turns each of the 3 attempts into a
  real resource-management decision: guess now on a hunch and risk both
  burning an attempt and tipping off the impostors, or wait for a stronger
  read.

---

## Vote-Kick Mechanic

- **Total impostor-vote-out attempts across the whole game = number of
  impostors present at game start.** E.g. 1 impostor at game start → the
  team gets exactly 1 vote-out attempt, total, for the entire game.
  Carried over unchanged from the original spec — this prevents
  brute-forcing impostors out via mass voting.
- **Voting is always optional and is not tied to cycle boundaries at
  all** — it doesn't gate or end a cycle, and isn't a forced per-cycle
  event the way the word guess is. It's available to call at any point as
  an alternative route to winning, similar to how Among Us handles
  emergency-meeting ejections against crew tasks: the main objective
  (solving the word) keeps running in parallel, and voting is a
  trump-card option the team can reach for whenever they want, independent
  of the forced-guess cadence.

---

## Win Conditions

**Player Win** — either path wins the game for the team:
- (a) Correctly guess the exact secret word, or
- (b) Correctly vote out **all** impostors present at game start. Partial
  elimination doesn't win it — every impostor must be caught, which given
  the vote cap above (total votes = starting impostor count) means the
  team has zero margin for a wrong vote if they intend to win this way.

**Impostor Win** — either path wins the game for the impostors:
- (a) Survive to the end of the fixed cycle count without the team
  guessing the word or fully voting out the impostors, or
- (b) The team exhausts all 3 word-guess attempts without success. This
  ends the game immediately, even before the cycle limit is reached.

This resolves an earlier asymmetry concern (impostors previously had only
1 win condition against the players' 2) — with the capped guess budget,
both sides now have exactly 2 win paths each, and impostor win (b) is
directly caused by the impostors successfully misleading the team, not
just passively running out the clock.

---

## Screens & UI Layout

No new screens are needed — this mode reuses the existing shell
(`setup-screen`, `peek-screen`, `game-screen`, `go-screen`) with adjusted
content, not new structure.

**Setup screen**: reused as-is (mode-specific options only).

**Peek screen — re-triggered every cycle**: instead of firing once before
`game-screen` loads (as in Standard/Cuckoo), `peek-screen` is shown again
at the start of every cycle to distribute that cycle's hints, then returns
to `game-screen`. **Critical implementation constraint**: this re-entry
must reuse the existing `G` game-state object and only refresh each
player's per-cycle hint field — it must *not* call `buildGameData()` again
(which would reshuffle roles) and must preserve `G.cycle`, elimination
status, and remaining vote/guess budgets exactly as they were. Flagged
specifically because routing back into a screen that was originally built
for a one-time reveal is an easy place to accidentally reset state that
should persist.

**Game screen — action panel**: reuses the existing vote-panel
(`index.html` `#vote-panel`), repurposed:

- **Kept unchanged**: "CONFIRM ELIMINATION" button and the tap-a-card
  vote-target selection on `cards-grid`. Adds a "X left" remaining-votes
  counter next to it, mirroring the guess counter, so both scarce
  resources are visible at a glance.
- **Dropped**: "👎 Skip" (its old job — advancing the cycle — is now the
  standalone Next Cycle button's job, since voting no longer drives cycle
  progression) and "🎯 Imposter Guessed The Word" (Standard-mode-specific,
  not applicable here).
- **Added**: a guess-word text box + "X/3 left" counter (team's shared
  guess budget, see Word-Guess Mechanic) with a single-tap submit — no
  in-app confirmation step, since agreement is expected to happen verbally
  between players before typing — and a large, bottom-of-screen
  "NEXT CYCLE" button that triggers the next peek-screen hint round.

`cards-grid` no longer needs to gate on a `play` phase to become
clickable — since voting is available any time rather than only during a
specific per-cycle phase, cards can simply stay selectable for the whole
game (until the vote budget is exhausted or the game ends). This is a
simplification opportunity worth noting for the implementation plan: this
mode may not need the phase state machine Standard/Cuckoo use at all.

---

## Guessing Rules (Secret Word)

Carried over unchanged from the original spec:

- Guesses must match the secret word **exactly** — no "very similar"
  guesses count.
- Each secret word has a small, pre-defined list of acceptable answers,
  limited strictly to close variations of the same word (capitalization,
  singular/plural, etc.) — not synonyms, related concepts, or anything
  else.

---

## Design Notes

- **Misinformation scales with player count, not just information volume.**
  At higher player counts, a bigger hint pool is also a proportionally more
  polluted one. E.g. at 9 players with the default 1:3 ratio, 3 of the 9
  hints given per cycle are misleading. This is a self-balancing property
  of the design, not a separate rule.
- **Wrong guesses are a double-edged tool.** Since guesses are scarce (3
  total) *and* public (leak the team's theory), each one is a real
  decision: is it worth spending an attempt now, on this hunch, knowing
  it'll also tip off the impostors if wrong?

---

## Open Questions (Unresolved — should be settled before implementation)

The core game-screen action panel and peek re-entry are now designed (see
Screens & UI Layout above). Remaining smaller UI details, not yet
discussed:

1. **Peek-card content/wording** for the repeated per-cycle reveal —
   exact phrasing for the three cases (real hint #1, real hint #2, "you're
   an impostor, the word is X"), and whether the peek card should show
   which cycle number this is.
2. **Status bar / cycle bar** at the top of `game-screen` — Standard/Cuckoo
   show live Players/Imposters counts, category, and cycle progress there.
   Does Reverse mode's status bar need different stats (e.g. guesses left,
   votes left), or do those live solely in the action panel below?
3. **Reveal/game-over messaging** for the now four distinct end states
   (word guessed, all impostors voted out, cycle limit reached, guess
   budget exhausted) — needs wording for each, similar to how Standard/
   Cuckoo differentiate their win/loss messages today.
