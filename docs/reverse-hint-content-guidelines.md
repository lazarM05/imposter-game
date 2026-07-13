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
group). Full target: **no repeated hint through a 7-player game** — i.e.
7 cycles × 2 hints = **14 fresh hints per word**, structured as 7 themes
× 2 values each. Games longer than 7 cycles (8+ players) are allowed to
start repeating earlier hints; that's expected and fine, not a bug.

**Current state: all 99 words have 8 hints each**, not yet the full 14.
This comfortably covers no-repeat freshness through a 4-player/4-cycle
game; larger tables will start wrapping and repeating sooner than the
full target until more hints are added per word. Runtime handles any
pool size generically (see Group Rotation below), so topping up to 14
later is just adding more entries per word, no code change needed —
deliberately deferred rather than doubling the authoring effort before
getting real playtest feedback on the 8-hint version.

## The Broadness Principle ("4-piece puzzle")

**The single most important rule, learned the hard way across two
revision passes**: no individual hint, and no *pair* of hints, should be
strongly diagnostic on its own. A hint like "Bark" for Dog or "Hull" for
Boat is an instant giveaway — one hint alone shouldn't let the team
converge. Since every cycle reveals *both* group hints to the whole
table at once, "guessable from 2 hints" really means "guessable in cycle
1," which ends the game before it starts.

Target: **it should take roughly 4 hints (2 cycles) before the word
becomes a strong, confident guess.** Each hint should individually be
true of many possible words — not just within the secret word's own
category (category is hidden in-game by default, so don't rely on it
narrowing anything), but across the *whole* 99-word bank. Only the
intersection of several broad, independent clues should collapse the
field down to one strong candidate.

## Hint Themes

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

- Concrete nouns and intrinsic-trait phrases (e.g. "Four legs," "Fur,"
  "Backrest"), not bare adjectives. An early revision tried vague
  adjectives (Soft, Compact, Warm) to chase broadness, but that just
  made hints feel like random words with no anchor — especially with
  the word category hidden by default. Broadness (how many words a hint
  could apply to) and concreteness (noun vs. adjective) are different
  axes; stay broad by picking traits shared across many words, not by
  making the hint itself abstract.
- Primarily single words, matching the existing word-association
  convention. Short 2-3 word phrases are allowed when a single word
  can't carry the idea (most often needed for Purpose hints, e.g.
  "cuts food," "keeps warm").
- **Vague, not a giveaway**: never the secret word itself, its plural,
  or a direct synonym — see the Broadness Principle above, which
  supersedes the earlier, looser "not so on-the-nose it's basically the
  answer" guidance with a concrete, testable bar (roughly 4 hints to a
  confident guess, not 2).
- **Never name a separate, companion object.** Describe the subject's
  own parts, materials, or actions — not another concrete thing that
  happens to sit near it or share its traits. "Dining table" for Chair
  is the canonical bad example: a table is a *different* guessable
  object, and it shares Chair's own broad traits (four legs, creaks),
  so naming it just hands the hunters a second correct-feeling answer
  instead of describing Chair itself.
- **Cross-check every hint against the word bank itself.** A hint value
  that happens to equal another word's `w[0]` (e.g. "Rice" as a hint for
  Sushi, or "Forest" as a Location hint for Owl) is a companion-object
  violation by definition — it names a real, separately-selectable
  secret word. Run a lowercase string match of every hint against all
  99 `w[0]` values before finalizing a batch; this bit us twice already.
- **At most one strongly-distinctive trait per word.** Check every pair
  of hints within a word's own list — no two hints should combine to
  make the word an instant, confident guess. "Backrest" + "Four legs"
  for Chair is the canonical bad pairing: each hint is fine broadness
  alone, but together they scream one specific object. In practice this
  showed up hardest with animal sounds ("Barking," "Mooing," "Roaring")
  which are each *individually* an instant giveaway by themselves, not
  even needing a second hint — a regression of the very first "Bark for
  Dog" problem this whole revision started from. Fix: pick one intended
  signature trait per word (often a visual body part — "Horns," "Long
  ears," "Curved beak" — since visual traits guess less instantly than
  species-specific sounds), and keep every other hint, including
  Sensory, generic enough that it doesn't independently name the word.
  This can't be verified exhaustively by hand for 99 words × 28 pairs
  each — treat it as a design discipline applied during authoring, not
  a guarantee, and expect playtesting to surface edge cases.

## Reuse Hints Across Different Words

**Explicitly encouraged, not just tolerated** — a hint repeating across
*different* secret words is fine and a deliberate way to cut the total
authoring workload, since players in any single game only ever see one
word's hint list; cross-word reuse is invisible in play. E.g. Dog and Cat
can both draw on Fur/Paws/Tail-type hints; Car and Train can both draw on
Window/Wheels/Metal/Transport-type hints. Build hints from a shared,
reusable vocabulary pool per theme (broad, generic values like "Metal,"
"Handheld," "Outdoors") and only invent a bespoke value when nothing in
the pool fits.

**The only hard rule: no duplicate hint within one word's own list.**
Two different words having overlapping hints is fine; the same word
having the same hint twice is not (it wastes a freshness slot for
nothing).

## Group Rotation (runtime behavior, not authoring)

Content is authored as a flat, unordered pool of `{theme, hint}` pairs
per word — **not** pre-split into "group A" / "group B" at authoring
time. Implemented in `game.js`'s `buildGameData()`: the word's hint pool
is shuffled once per game (`G.hintPool`), then `renderPeekCard()` in
`ui.js` deals 2 entries per cycle (index `(cycle-1)*2 + 0` for group A,
`+1` for group B), wrapping via modulo once the pool is exhausted — so
this works the same regardless of whether a word has 8, 14, or any other
count of hints authored, no code change needed as batches grow. Words
without any authored entry yet fall back to the original
`Hint {cycle}{group}` placeholder.

## Data Storage

`src/reverseHints.js`, keyed by secret word (matching `w[0]` strings
exactly — a key that doesn't match a real `w[0]` is dead data and will
never be picked; verify with a quick script when editing, see the repo's
recent history for an example, since this bit us once already with
"Cheese," which only ever appears as `w[1]`). Each value is an array of
8 `{ theme, hint }` objects. Kept separate from `words.js` — additive,
doesn't touch the existing tested word-pair structure used by
Standard/Cuckoo.

**All 99/99 words have entries.** The placeholder (`Hint {cycle}{group}`)
only remains as a defensive fallback in `ui.js` for words that might lose
their entry in a future edit — it shouldn't normally be seen in play
anymore.
