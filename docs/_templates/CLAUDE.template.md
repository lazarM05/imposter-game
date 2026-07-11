# {{Project Name}} — Architectural Guide

{{One or two sentences: what this is, who/what it's for.}}

## Maintaining this file

This file is read by Claude at the start of every session. Keep it accurate.

**When to update:**
- A new file or directory is added
- A file's responsibility changes significantly
- A new architectural pattern or convention is introduced
- An existing pattern described here is removed or reworked

**When NOT to update:**
- Bug fixes, small refactors, or new content within existing patterns
- Line-level changes — this file describes roles, not contents

**How to update:**
- Edit the relevant section in place; don't append a changelog
- Keep each file description to one line
- If a section no longer reflects reality, rewrite it — don't patch around it

---

## File Map

<!-- Empty at project start. Add one row per top-level file/dir as it's created, one line each. Add a sub-table per subdirectory once it has more than a couple files. Document roles, not contents — a new session should be able to navigate without re-reading everything. -->

### Root

| File | Role |
|---|---|
| _(none yet)_ | |

---

## Key Patterns

<!-- Empty at project start. Add a subsection the first time some behavior is non-obvious enough that a future session would otherwise have to re-derive it — a tricky invariant, a workaround for a specific bug, "why it's built this way and not the obvious way." Don't pre-write patterns for code that doesn't exist yet. -->

---

## Conventions

<!-- Filled in during the install interview; appended to as new conventions get established. -->

- **Language/stack:** {{}}
- **Naming:** {{}}
- **Formatting/lint tool:** {{}}
- **Private/internal members:** {{}}

---

## Design Docs (`docs/`)

Design docs, mockups, and specs live in `docs/`. Not read at runtime.

- **Durable** design rationale (should survive after implementation) goes in `docs/` directly, or `docs/superpowers/specs/` if using the superpowers brainstorming/writing-plans workflow — tracked in git.
- **Ephemeral** task-breakdown plans go in `plans/` or `docs/superpowers/plans/` — gitignored, since they go stale the moment the work lands.
- Use dated filenames (`YYYY-MM-DD-topic.md`) for anything that might later be superseded. When a design changes, mark the old doc as superseded in its own header instead of deleting it, and note the supersession in the new one.

**Before implementation work**, grep `docs/` for relevant docs first — they're the source of truth for decisions already made.

---

## TODO.md Structure

The task tracker (`TODO.md`) has three sections:

- **Ongoing Tasks** — open work, grouped by area and priority.
- **Completed Tasks** — collapsed by session, one-line summary per item.
- **Discussion Topics** — non-code items to talk through later.

Use `Grep` to find tasks by keyword rather than reading the whole file.

---

## Running / Build Protocol

<!-- Fill in during the install interview. -->

- **Run:** {{command}}
- **Session start check:** {{verify before changing anything? how?}}
- **After changes:** {{re-verify every time, or only on request?}}

---

## Iteration Mode

<!-- The single highest-leverage section — sets the default rigor so Claude doesn't over- or under-verify. Fill in during the install interview; revisit if it stops matching how you actually work. -->

{{Default, e.g.: "fast, low-overhead loop — user tests manually, batch heavy verification for later" OR "test-driven — write/run tests for every change before moving on."}}

**Always applies regardless of default** (categories that need extra care no matter what — e.g. data format/schema changes, auth, payments, migrations):
- {{}}

**Switching modes:** if the user asks to "review this," "run the tests," or similar, leave the default for that request, then return to it afterward.

---

## Git & GitHub

<!-- Fill in during the install interview — confirm the repo actually exists, don't assume. -->

- **Remote:** {{}}
- **Branch:** {{}}
- **Commit granularity:** {{}}
- **Branching strategy:** {{}}
- **Don't commit:** {{}} (mirror in `.gitignore`)
