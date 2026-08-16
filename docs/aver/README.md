# AVER — Agent Versioning

Author: adezdev
Status: pre-alpha, v0.1

Semver tells you how much code changed. That's not what I want to know
when I'm handing a task to an agent. I want to know which model's behind
the wheel, what it's allowed to touch, how much rope it's got, and which
guardrails are actually loaded right now. major.minor.patch has no room
for any of that, it's built for libraries and an agent isn't one, it makes
its own calls.

Four things instead, tracked separately because they don't move together:

- **mind**, which model/controller is deciding what happens
- **capability**, what it can actually perceive and act on
- **autonomy**, how much it can do before it needs a human to sign off, and
- **policy**, whatever guardrail/alignment ruleset is loaded right now

Swap the model and the tools don't change. Add a tool and the permission
ceiling doesn't move either. Tighten a guardrail after an incident, still
nothing else moves. Cram all four into one linear number the way semver
does and you get an agent that looks like a patch bump and can suddenly
push to prod.

## Format

```
version    = "v" vendor ":" mind "." capability "." autonomy "-" policy
vendor     = 1*(ALPHA / DIGIT / "-")
mind       = 1*(ALPHA / DIGIT / "-" / ".")
capability = 8HEXDIG
autonomy   = "0" / "1" / "2" / "3"
policy     = 1*(ALPHA / DIGIT)
```

```
v anthropic:sonnet-5.9f3c21a0.2-a3f9c1
  └vendor┘ └mind┘ └capability┘│└policy┘
                               autonomy
```

(space after `v` is just for the diagram, not part of the real string)

## Docs

- [fields.md](fields.md) — what each of the four fields means and when it bumps
- [comparison.md](comparison.md) — how to compare versions, and the capability manifest
- [examples.md](examples.md) — worked examples, real version strings and transitions
- [CHANGELOG.md](CHANGELOG.md) — what changed and what's still unresolved

## What this isn't

This versions the agent, not whatever it produces or ships, it's not a
semver replacement for your actual software.

mind and policy are identity fields, not rank, so don't try to sort
vendors by them, there's nothing to sort.

And autonomy is a declared ceiling, not a guarantee. Setting it to `1`
doesn't prove the agent can't do more, it just says what it's supposed to
stay under.
