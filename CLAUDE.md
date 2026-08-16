# verModal

You're maintaining AVER (Agent Versioning), a version scheme for AI
agents/robots. Spec + a small CLI, that's the whole repo. Read
`docs/aver/README.md` before touching field semantics, the hashing rule, or
the grammar, it's the source of truth (fields.md and comparison.md have the
detail). If a field's behavior needs to change: spec first, then code, then
a changelog line in `docs/aver/CHANGELOG.md`. People (and past-me) keep
wanting to do it in whatever order is easiest and it just makes the spec
drift from what the CLI actually does.

## Layout

- `docs/aver/` — the spec, split into README (overview + format), fields.md,
  comparison.md, examples.md, CHANGELOG.md
- `src/aver.ts` — hashing, formatting, parsing, verification
- `src/cli.ts` — CLI wrapper (`generate` / `parse` / `verify`)
- `examples/` — sample manifest/policy for a Claude-Code-style agent, plus
  the `version.json` those generate

## Build & run

Runs on Bun, straight from `src/`, no compile step:

```
bun run src/cli.ts generate --vendor <v> --mind <m> --manifest <file.json> --autonomy <0-3> --policy-source <file> [--out version.json]
bun run src/cli.ts parse <version>
bun run src/cli.ts verify <version> --manifest <file.json>
bun run typecheck      # tsc --noEmit, catches type errors, doesn't emit anything
```

There's no `dist/`. Used to have one (npm + tsc), switched to Bun so the
CLI just runs the TS directly. Don't add a build step back in for this.

## Rules

Stdlib only (`node:fs`, `node:crypto`, both work fine under Bun). If you
think this needs an npm dependency, you're probably solving a problem that
doesn't exist yet — ask first.

`capability` is a sha256 hash of the sorted manifest. Not a count. I tried
a count in the first draft and it can't tell a 1-for-1 tool swap from no
change at all, so don't go back to it (changelog in the spec has the story
if you want it).

Autonomy is the only ordered field, 0 through 3. mind, capability, and
policy are equality checks only — no `>=`/`<=` against them, ever.

Keep argv parsing and process.exit() out of aver.ts. That file should stay
usable somewhere that isn't a CLI someday. cli.ts is the only place that
should know it's a CLI.

Grammar or new-field changes go in `docs/aver/README.md`'s format section
AND `docs/aver/CHANGELOG.md`, same commit. Don't leave the spec behind.

## Branching

Never commit new work straight to `master`. Branch first, `master` stays
whatever's actually shipped. Name the branch for what it does, not who's
doing it or when: `<type>/<short-description>` using the same type prefixes
as commits (`feat/`, `fix/`, `docs/`, `refactor/`, `chore/`, etc.), lowercase,
hyphens, no ticket numbers since nothing here is tracked in an issue tracker
yet. E.g. `feat/robotics-autonomy-tiers`, `docs/split-spec-into-pages`,
`fix/capability-hash-ordering`. Open a PR into `master` when it's ready
rather than merging locally.

## Commits

Follow `.claude/rules/conventional-commits.md` for every commit message,
including the scope table it lists for this repo (`aver`, `cli`, `spec`,
`hooks`, `examples`, `deps`). Never add a `Co-Authored-By` trailer, see
`.claude/rules/no-co-authoring.md`, that overrides the default behavior.

## Hooks

.claude/settings.json has a SessionStart hook that regens
examples/version.json off the sample manifest/policy files via `bun run
src/cli.ts generate`. It's hardcoded
to those paths and flags, not derived from anything, so if you rename CLI
flags or move examples/ around, go fix the hook too or it just quietly
breaks and nobody notices for a while.
