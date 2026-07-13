# Reverse Mode — Hint Content Guidelines

A living reference for authoring real hint content for Reverse mode,
replacing the `Hint {cycle}{group}` placeholders. Edit in place as the
rules evolve — this isn't a point-in-time spec.

---

## Word Source

Secret words are `w[0]` from each existing `words.js` entry — the same
99 words already used as the "real" word in Standard/Cuckoo mode. No
code change needed; `game.js` already does `secretWord: entry.w[0]`.
`w[1]` (the paired/similar word) is not used by Reverse mode.

| Category | Word count |
|---|---|
| Animal | 20 |
| Food | 25 |
| Object | 20 |
| Nature | 15 |
| Vehicle | 7 |
| Place | 7 |
| Clothing | 5 |
| **Total** | **99** |

---

## Freshness Target

`maxCycles = player count`, and each cycle needs 2 fresh hints (one per
group). Target: **no repeated hint through a 7-player game** — i.e. 7
cycles × 2 hints = **14 fresh hints per word, minimum**. Games longer
than 7 cycles (8+ players) are allowed to start repeating earlier hints;
that's expected and fine, not a bug.

## Hint Themes

14 hints per word, structured as **7 themes × 2 values each** — this
maps exactly onto the freshness target: every theme contributes exactly
2 distinct hints, so a full 7-cycle game uses each theme's full pair
without ever repeating a specific value.

| Theme | Angle |
|---|---|
| Purpose | What it's used for / what it does |
| Material | What it's made of / physically composed of |
| Shape | Physical shape or form |
| Color | Typical color association |
| Sensory | A touch/smell/sound/sight cue — pick whichever sense fits the word best |
| Location | Where you'd typically find or encounter it |
| Size | Relative size or scale |

Not every theme will fit every word perfectly (e.g. "Color" for
something colorless) — when a theme doesn't fit cleanly, substitute the
closest reasonable angle rather than forcing it. Minor imperfect fits are
fine; hints are meant to be indirect, not exhaustive.

## Hint Style

- Primarily single words, matching the existing word-association
  convention. Short 2-3 word phrases are allowed when a single word
  can't carry the idea (most often needed for Purpose hints, e.g.
  "cuts food," "keeps warm").
- **Vague, not a giveaway**: never the secret word itself, its plural,
  or a direct synonym. Should feel like a real but indirect clue — not
  so obscure it's unusable, not so on-the-nose it's basically the
  answer. The team should plausibly land on the word within 2-3 cycles
  if the hints are read well, per the mode's original design intent.

## Group Rotation (runtime behavior, not authoring)

Content is authored as a flat, unordered pool of `{theme, hint}` pairs
per word — **not** pre-split into "group A" / "group B" at authoring
time. At runtime, each cycle:
1. Picks 2 themes not yet used this game (falls back to reuse once all
   7 are exhausted, for 8+ cycle games).
2. Assigns one theme to group A, one to group B.
3. Picks one of that theme's 2 values, preferring a value not yet shown
   this game.

This is a **future implementation task**, not yet wired into `ui.js` —
right now `renderPeekCard()` still shows the `Hint {cycle}{group}`
placeholder. This doc covers content only; wiring real hints into the
peek flow is a separate follow-up.

## Data Storage

New file `src/reverseHints.js`, keyed by secret word (matching `w[0]`
strings exactly), each value an array of 14 `{ theme, hint }` objects.
Kept separate from `words.js` — additive, doesn't touch the existing
tested word-pair structure used by Standard/Cuckoo.
