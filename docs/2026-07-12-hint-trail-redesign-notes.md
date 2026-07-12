# Hint Trail Redesign — Session Notes (2026-07-12)

Working notes from a design conversation reworking the "Hint Trail" mode (see
`docs/Imposter-Cuckoo_HintTrail_GameMode.md`, the original spec). This is
**not yet a finished spec** — several mechanics are unresolved. Once the open
questions below are settled, this should be folded into a proper replacement
spec doc (and the original marked superseded per this repo's doc conventions).

The redesign is expected to come with a **mode name change** away from "Hint
Trail" — not yet chosen.

---

## Established So Far

**Core flip — impostors know the real word, not a fake one:**
- Impostors are now told the actual secret word (instead of being given a
  separate "fake word" to build hints around, as in the original spec).
- Impostor task: each cycle, invent a misleading hint that plausibly points
  away from the secret word, trying to keep the group from guessing it.
- Non-impostor players still get a real hint word each cycle, carried over
  unchanged from the original spec (not explicitly revisited this session —
  see Open Questions).

**Win conditions:**
- Players win by either: (a) the team correctly guessing the secret word, or
  (b) correctly voting out the impostor(s).
- Impostors win by surviving to the end of the fixed cycle count. Single win
  condition (no Easy/Hard split like the original spec) — discussed and
  considered acceptable: asymmetric win-condition counts are normal in
  social deduction games (e.g. Mafia/Werewolf), especially since impostors
  now hold more information (the real word) than before.

**Impostor vote-out mechanic (carried over from original spec):**
- Total vote-out attempts across the whole game = number of impostors present
  at game start (e.g. 1 impostor → only 1 vote-out attempt, ever). Prevents
  brute-forcing impostors out via mass voting.

**Word-guess mechanic (new — replaces the original's optional per-cycle vote
+ shared 3-guess budget):**
- At the end of every cycle, the whole team must reach consensus and submit
  **one forced guess** at the secret word (not optional).
- A wrong guess costs nothing beyond not winning that cycle — no separate
  guess-count budget.
- Because the guess is spoken aloud to the group, a wrong guess leaks the
  team's current theory to the impostors (who know the real word), letting
  them steer future fake hints away from it. This is an intentional active
  counterplay lever for impostors, addressing the single-win-condition
  passivity concern above.

**Cycle limit (new):**
- Fixed at `cycles = total player count` (including impostors), replacing
  the original's flat "3 cycles, configurable" default.
- Chosen specifically to bound total hint accumulation — without a hard
  cap, players could stall indefinitely (declining to guess) while
  accumulating more and more real hints, making the word trivial and the
  impostors' job effectively impossible.
- Considered and rejected: forcing a vote (rather than a guess) every cycle
  — doesn't actually bound hint accumulation, since "no kick" is always a
  valid vote outcome and the kick-budget is already capped separately.

**Misinformation scales with player count (observation, not a rule change):**
- At higher player counts, a bigger hint pool is also a proportionally more
  polluted one. E.g. 9 players at the default 1:3 ratio → 3 of 9 hints per
  cycle are misleading. Noted as a self-balancing property of the design.

---

## Open Questions (Unresolved)

1. **New mode name** — not yet chosen.

2. **Hint-content scaling problem (biggest open issue).** One unique,
   non-duplicate real hint is needed per non-impostor per cycle, and cycles
   now scale with player count. Total unique hints needed per secret word ≈
   `(n − impCount) × n`, which grows roughly quadratically:
   - 9 players (3 imp / 6 real) → ~54 hints for one word
   - 12 players → ~96 hints
   - 15 players → ~150 hints
   This makes larger tables — arguably the most fun version of this mode —
   the hardest to author content for. Candidate directions raised, none
   decided:
   - Decouple max cycle count from strict `n` scaling so the hint list per
     word stays bounded regardless of table size.
   - Relax "no duplicate hint" from per-game scope to per-cycle scope, so
     only one cycle's fan-out needs unique hints, not the whole game.
   - Accept a lower player-count ceiling for this mode specifically (doesn't
     have to match Standard/Cuckoo's supported range) as a deliberate scope
     limit.

3. **Does the non-impostor "one real hint per cycle" mechanic carry over
   unchanged**, or does anything about it change under the new design?
   Assumed unchanged so far, but not explicitly re-confirmed this session.

4. **Does the vote-out win path require catching *all* impostors**, given
   the vote cap exactly equals the starting impostor count (zero margin for
   a wrong vote if so)? The original spec's win condition was "vote out all
   impostors before the cycle limit" — needs re-confirming under the new cap.

5. **Do the vote-out check and the forced word-guess both happen in the same
   cycle** (two decision points per cycle), and if so, in what order?

6. **Is there a "pass" option for the forced guess**, or are teams expected
   to guess blind in early cycles (e.g. cycle 1, with almost no hints yet)?
   Currently leaning toward no cost for wrong guesses, so blind guessing may
   just be accepted as part of the tension — not decided.
