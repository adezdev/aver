# verModal

AVER (Agent Versioning) — a version scheme for AI agents and robots
instead of software releases. Semver tells you how much code changed,
which isn't what you need to know when you're handing a task to an agent.
AVER tracks four things separately: which model's driving, what it can
touch, how much it's allowed to do without a human, and which guardrails
are active.

Full writeup is in [docs/aver](docs/aver/README.md). This repo is that
spec plus a small CLI for generating and checking version strings.

```
v anthropic:sonnet-5.9f3c21a0.2-a3f9c1
  └vendor┘ └mind┘ └capability┘│└policy┘
                               autonomy
```

## Install

Needs [Bun](https://bun.sh), 1.3+. Runs the TS directly, no build step.

```
bun install
```

## Use

```
bun run src/cli.ts generate \
  --vendor anthropic --mind sonnet-5 \
  --manifest examples/claude-code-manifest.json \
  --autonomy 2 \
  --policy-source examples/claude-code-policy.txt \
  --out examples/version.json

bun run src/cli.ts parse "vanthropic:sonnet-5.9f3c21a0.2-a3f9c1"

bun run src/cli.ts verify "vanthropic:sonnet-5.9f3c21a0.2-a3f9c1" \
  --manifest examples/claude-code-manifest.json
```

`generate` builds a version string from a tool/actuator manifest, an
autonomy level (0–3), and a policy file, and writes `{version,
capability_manifest}` if you pass `--out`. `parse` just splits a version
string into its fields. `verify` checks that a version's capability hash
actually matches a given manifest.

There's a sample manifest and policy in `examples/`, modeled on a Claude
Code session's tool set.

## Docs

Everything past the pitch above lives in [docs/aver](docs/aver/README.md),
that's where the actual field definitions, comparison rules, and worked
examples are.

## Status

Pre-alpha, v0.1. First-pass proto schema — the four fields and the hashing
approach for `capability` feel right but haven't been used outside this
repo yet. Vendor namespacing and how robotics extends `autonomy` are still
open — see the changelog. Expect breaking changes.

## License

Apache-2.0, see [LICENSE](LICENSE).
