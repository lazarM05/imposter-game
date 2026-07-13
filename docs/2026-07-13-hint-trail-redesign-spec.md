# Hint Trail Redesign — Design Spec
### Design Document

Supersedes `docs/Imposter-Cuckoo_HintTrail_GameMode.md` (see that file's own
header for the supersession note) and folds in
`docs/2026-07-12-hint-trail-redesign-notes.md`, the running session notes
this spec was compiled from. This is the current source of truth for the
mode's design, but it is **not fully locked** — see Open Questions at the
end. A mode name has not been chosen yet; "Hint Trail" is used throughout
as a working title only.

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
- **Non-impostor players** receive one real hint word per cycle, related to
  the secret word (carried over from the original spec's hint mechanic —
  see Open Questions, this hasn't been explicitly re-confirmed this
  session).
- **Impostor Task**: Each cycle, every impostor privately invents their own
  misleading hint word designed to steer the group away from the secret
  word, then shares it alongside the real hints as if it were genuine.

---

## Impostor Ratio

Unchanged from the original spec — roughly 1:3, one impostor per 3 players.

| Player Count | Impostors |
|---|---|
| 5 | 1 |
| 6 | 2 |
| 9 | 3 |

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

Carried over unchanged from the original spec:

- **Total impostor-vote-out attempts across the whole game = number of
  impostors present at game start.** E.g. 1 impostor at game start → the
  team gets exactly 1 vote-out attempt, total, for the entire game.
- This prevents brute-forcing impostors out via mass voting, same as
  before.

---

## Win Conditions

**Player Win** — either path wins the game for the team:
- (a) Correctly guess the exact secret word, or
- (b) Correctly vote out the impostor(s).

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

1. **New mode name** — not yet chosen. Affects internal key naming,
   UI copy, and this doc's eventual filename.

2. **Hint-content scaling problem (biggest open issue).** One unique,
   non-duplicate real hint is needed per non-impostor player per cycle, and
   cycles now scale with player count (`cycles = n`). Total unique hints
   needed per secret word ≈ `(n − impCount) × n`, which grows roughly
   quadratically:
   - 9 players (3 imp / 6 real) → ~54 hints for one word
   - 12 players → ~96 hints
   - 15 players → ~150 hints
   Candidate directions raised, none decided:
   - Decouple max cycle count from strict `n` scaling so the hint list per
     word stays bounded regardless of table size.
   - Relax "no duplicate hint" from per-game scope to per-cycle scope, so
     only one cycle's fan-out needs unique hints, not the whole game.
   - Accept a lower player-count ceiling for this mode specifically (it
     doesn't have to match Standard/Cuckoo's supported range).

3. **Does the "one real hint per non-impostor per cycle" mechanic carry
   over unchanged** from the original spec, or does anything about it
   change under the new design? Assumed unchanged so far but never
   explicitly re-confirmed.

4. **Does the vote-out win path require catching *all* impostors**, given
   the vote cap exactly equals the starting impostor count (zero margin for
   a wrong vote if so)? The original spec's win condition was "vote out all
   impostors before the cycle limit" — needs re-confirming under the new
   cap.

5. **Do the vote-out check and the forced word-guess both happen in the
   same cycle** (two decision points per cycle), and if so, in what order?

6. **Is there a "pass" option for the forced guess**, or are teams expected
   to guess blind in early cycles (e.g. cycle 1, with almost no hints yet)?
   Currently leaning toward no cost for wrong guesses, so blind guessing
   may just be accepted as part of the intended tension — not decided.
