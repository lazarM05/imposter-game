# Carried-Forward Lessons (from GridMaze)

These are process and collaboration patterns validated through real use on a previous project — not that project's domain content. Read all of them and fold in whichever apply to this project's `CLAUDE.md`; discard anything that doesn't fit (e.g. skip the UI-specific ones if this project has no UI).

## Collaboration defaults — carry these forward as-is

1. **Brainstorm before building.** For any "add/change/implement X" request, work through understanding → clarifying questions → proposed approach before writing code, without being asked to do so each time. Skip only for trivial, unambiguous one-liners (e.g. a rename) where there's nothing to clarify.
2. **Default straight to Subagent-Driven Development once a plan is ready.** Don't ask which execution mode to use — go straight to a fresh implementer subagent per task with spec-compliance + code-quality review. Still stop for genuine blockers (implementer reports blocked, a review finds unresolved issues) — this is about skipping the mode-selection question, not about skipping review gates.
3. **During live iteration, skip automated review and test runs between edits.** Once the user is manually testing a feature in the running app, just make the change and let them test — no reviewer subagents, no test-suite runs after each tweak, even mid-plan. Do the heavy review/quality pass only after the user confirms the feature works end-to-end, or when something breaks and needs root-causing. Don't conflate the two phases.
4. **Task-tracker entries preserve exact specifics, never summaries.** If the user says "buttons: Retry, Edit, and Exit," write exactly that — not "appropriate buttons." Future sessions only see the tracker, not the conversation that produced it; summarizing away detail forces the user to repeat themselves.

## Structural patterns worth re-adopting

5. **Name the default rigor level explicitly** (an "Iteration Mode" section) — plus the categories that always get extra care regardless of the default (data/schema changes, auth, migrations, anything with real consequences if wrong). Without this, either every tiny change gets reviewed like a PR, or nothing does.
6. **Gate schema/format-versioning work to commit time, not every edit.** Check whether a diff touches a persisted data shape only right before committing. Mid-session field renames are normal; writing a migration for each intermediate tweak is wasteful.
7. **Date design docs and mark supersession instead of deleting.** `YYYY-MM-DD-topic.md` filenames; when a design changes, mark the old doc "superseded by X" in its own header. History stays legible without becoming a graveyard of dead files.
8. **Split docs into durable vs. ephemeral, enforced by `.gitignore`.** Design rationale worth keeping long-term goes in a tracked docs folder; disposable task-breakdown plans go in a gitignored `plans/` folder. Stops the repo from accumulating stale planning artifacts.
9. **Have `CLAUDE.md` document its own update rules** — when to touch it, when not to, how to edit it (in place, no changelog). This is what stops it from rotting or ballooning.

## Domain-specific patterns — only if this project has an analog

10. If this project has an interactive editor/canvas: define the placement/interaction UX model explicitly in one place (e.g. "cursor is replaced by the object being placed" vs. a modal tool state) and document it as a hard invariant, not something to re-derive per feature.
11. If this project has a UI: write down hard readability/style floors (minimum font size, contrast, etc.) once in a design doc and treat them as non-negotiable — not something to eyeball fresh each session.

---

Items 1–4 are behavioral and won't show up from reading file structure alone — they're worth stating to Claude explicitly. Items 5–9 are already reflected structurally in `CLAUDE.template.md`; restated here with the reasoning, since the "why" is what makes them worth keeping under different circumstances.
