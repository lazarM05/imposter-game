# New Project Install Prompt (the "seed")

## What to actually send Claude Code

Open Claude Code in the new project's folder (after it has a git repo — see reminder at the bottom), then send this one line as your first message:

> Read every file in `C:\Users\lazar\OneDrive\Documents\Claude\Projects\_templates\` — `install-prompt.md`, `CLAUDE.template.md`, `lessons-learned.md` — and follow `install-prompt.md`'s instructions to set up this project.

That's the whole first message. Don't paste raw file contents and don't retype anything below — Claude Code can read absolute paths on disk directly, so it pulls all three files itself. Everything from here down is written *for Claude to read*, not for you to copy.

---

## Instructions (Claude reads this section, not the human)

This is a brand new project folder. Before writing any code, interview the user about what they're building, then use their answers to write a `CLAUDE.md` file that will guide every future session here.

First, read `lessons-learned.md` (same folder as this file) so its items are in mind — don't apply any of them yet, just hold them for after the interview.

Ask about these topics one at a time, not all at once:

1. **What this is** — one-line description, who/what it's for, and the primary language/framework/stack.
2. **Starting structure** — does the user already know the folder layout, or should you propose one based on the stack once you've talked?
3. **Default rigor** — review/test every change as it lands, or fast low-friction iteration where the user tests manually and you tighten up before commits? Separately: any categories of change (data formats/schemas, auth, payments, migrations, anything with real consequences if wrong) that should always get extra rigor no matter what the default is?
4. **Git/GitHub conventions** — commit granularity, branching strategy, whether the repo is already created and connected as `origin` (confirm — don't assume), public or private.
5. **Documentation appetite** — how much design-doc writing before implementation? Dated docs kept around after superseded, or a lighter touch?
6. **Standing "don't do X without asking" rules** specific to this project, beyond general defaults.

Once you have the answers, read `CLAUDE.template.md` (same folder as this file) and use it as the skeleton for this project's `CLAUDE.md` — fill in each section from the answers, and leave sections that don't apply yet genuinely empty (e.g. the File Map has no rows since there's no code) rather than inventing placeholder content.

Then revisit `lessons-learned.md`: fold in whichever collaboration defaults (items 1–4) and structural patterns (items 5–9) fit how the user wants to work — most of 5–9 just confirm what's already in the template skeleton, so they mainly inform tone/emphasis, not new sections. Skip the domain-specific items (10–11) unless the user's answers indicate an actual analog (e.g. item 10 only applies if this project has an interactive editor/canvas).

Also create, in the same pass:
- `TODO.md` with the Ongoing / Completed / Discussion structure described in the template
- an empty `docs/` folder for design docs
- a `.gitignore` matching the stack discussed, including `.claude/` and whatever ephemeral-plan-file convention is used
- confirm everything with the user before finalizing, and explicitly flag if the GitHub remote still isn't connected — don't assume it is

---

## Reminder: set up the repo *before* sending that message

The Git & GitHub section of the template needs a real answer, not a guess. Before opening Claude Code in the new folder:

1. Create the project folder.
2. `git init`, and either create the GitHub repo first (`gh repo create <name> --private --source=.`) or create it on GitHub and add it as `origin` (`git remote add origin <url>`).
3. *Then* open Claude Code in that folder and send the one-line message above.
