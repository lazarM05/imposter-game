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
(which was the source of the quadratic hint-content scaling problem), the
**non-impostors are split into a small number of groups**, and everyone in
a group gets the same real hint word. The number of groups ("variety") is
smaller than the non-impostor count and is tied to the impostor count —
this is what keeps the content list small regardless of table size.

Worked examples given during design:
- **1 impostor** (small table): 2 distinct hints exist that cycle — 1 real,
  1 fake (from the 1 impostor).
- **3 impostors, 6 non-impostors** (9 players total): 2 distinct **real**
  hints exist that cycle. The 6 non-impostors split into two groups of 3,
  each group getting one of the 2 real hints. The 3 impostors then each
  choose to either invent their own fake hint (and coordinate their
  stories with each other) or repeat one of the 2 real hints to blend in.

This turns "hints per word" from `(n − impCount) × cycles` into
`variety × cycles`, where `variety` is small and doesn't scale with table
size the same way — a large reduction in required content. **The exact
formula mapping impostor count (or player count) to `variety` is not yet
pinned down** — see Open Questions.

**Content authoring, for now**: hint content will be placeholder templates
("Hint 1", "Hint 2", "Hint 3", ...) rather than real curated hints. Writing
real hint content per word is deferred to later, once the mechanic itself
is validated.

---

## Round Structure (Cycles)

1. **Start of Cycle**: Non-impostor players receive a new real hint word.
   Impostors privately invent a new misleading hint.
2. **Hint Sharing**: All players (impostors included) share their hint word
   with the group.
3. **Discussion**: Group discusses which hints feel "off" and who might be
   an impostor.
4. **Forced Word Guess**: The team must reach consensus and submit one
   guess at the secret word before the cycle ends (see Word-Guess Mechanic
   below) — this is mandatory, not optional.

## Cycle Limit

- **Fixed at `cycles = total player count`** (including impostors).
- This replaces the original spec's flat "3 cycles, configurable" default.
- Chosen specifically to bound how much hint information can accumulate —
  without a hard cap tied to player count, the team could stall
  indefinitely (declining to commit to a guess) while collecting more and
  more real hints, eventually making the word trivial and the impostors'
  job effectively unwinnable.
- **Rejected alternative**: forcing an impostor-vote (rather than a word
  guess) every cycle. This doesn't actually bound hint accumulation, since
  "no kick" is always a valid vote outcome, and the kick budget is already
  capped separately (see below) — it would add friction without solving
  the stalling problem.

---

## Word-Guess Mechanic

- At the end of every cycle, the whole team must come to agreement and
  designate one person to submit **a single team-consensus guess** at the
  secret word. This is forced, not optional — the team commits to a guess
  every cycle regardless of confidence.
- A wrong guess costs the team nothing beyond not winning that cycle —
  there is **no separate guess-count budget** (this replaces the original
  spec's shared "3 guesses total" pool).
- Because the guess is spoken aloud to the whole group, a wrong guess
  reveals the team's current theory to the impostors — who already know
  the real word — letting them steer future fake hints away from wherever
  the team's guess just landed. This is an intentional, active counterplay
  lever for impostors (see Win Conditions below for why this matters).

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

**Impostor Win** — single condition:
- Survive to the end of the fixed cycle count (i.e. the team neither
  guessed the word nor used up their vote-kick budget successfully).

This is a deliberate asymmetry (1 impostor win condition vs. 2 player win
conditions), discussed and considered acceptable rather than a balance gap:
asymmetric win-condition counts are common in social deduction games (e.g.
Mafia/Werewolf — the "evil" side often has a single, simpler win
condition). It's a reasonable trade here specifically because impostors now
hold more information than before (they know the real word), and the
forced-guess mechanic above gives them an active, skill-driven way to
defend that advantage rather than just passively running out the clock.

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
- **Wrong guesses are a double-edged tool.** Since guesses are free
  (no budget) but public (leak the team's theory), the tension isn't "can
  we afford to guess" but "does guessing now help the impostors more than
  it helps us."

---

## Open Questions (Unresolved — should be settled before implementation)

1. **Exact hint-variety formula.** Two data points exist (1 impostor → 1
   real hint group; 3 impostors / 9 players → 2 real hint groups) but no
   general formula mapping impostor count (or player count) to number of
   real-hint groups has been pinned down yet. Needed before the variety
   mechanic can actually be implemented.

2. **Is there a "pass" option for the forced guess**, or are teams expected
   to guess blind in early cycles (e.g. cycle 1, with almost no hints yet)?
   Currently leaning toward no cost for wrong guesses, so blind guessing
   may just be accepted as part of the intended tension — not decided.

3. **UI/visual design** — screen layouts, widget placement, how hint
   groups/voting/guessing are actually presented on screen — hasn't been
   discussed yet at all. Likely reuses the existing six-screen shell
   (home/setup/peek/game/reveal/game-over) per this project's established
   architecture, but the mode-specific content within those screens (hint
   display, team-guess input, vote trigger) still needs to be designed.
