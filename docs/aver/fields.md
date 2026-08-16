# The four fields

See [README.md](README.md) for the overall format. This is the detail on
each field: what it means, what makes it bump, how it relates to the rest.

## vendor:mind

Which model or controller is making the decisions. Namespaced by vendor so
`anthropic:sonnet-5` doesn't collide with someone else's `sonnet-5` if that
ever becomes a thing.

Bumps only when the underlying model changes, and when it does, capability
and policy usually need recomputing too since a new mind tends to ship
with a different default toolset and guardrail config. Says nothing about
autonomy. Autonomy gets set by whoever's operating the thing, not the
vendor shipping the model.

Don't rank minds across vendors. There's no total order for "which model
is better" and I'm not going to pretend AVER has one. Equality only.

## capability

8 hex digits, a hash of the tool/actuator set:

```
capability = hex(sha256(join(sort(manifest_entries), ",")))[:8]
```

Sorted before hashing so order in the manifest doesn't matter. First draft
of this was just a tool count and it fell apart immediately: swap one tool
for another and the count stays identical while the agent's actual
capabilities changed completely. Hash catches that, count doesn't.

Bumps whenever the set changes at all, add, remove, swap. Gets recomputed
on a mind bump too. Equality only, same as mind, if two hashes differ you
know the sets differ, you don't know how. Go diff the manifest for that —
see [comparison.md](comparison.md) for the manifest format.

## autonomy

The field worth standardizing hard because it's what an orchestrator
actually gates on:

| value | name | meaning |
|---|---|---|
| `0` | read-only | can look, can't touch |
| `1` | propose | drafts (code, plans, messages), doesn't send or execute |
| `2` | execute-reversible | local edits, reversible commands, sandboxed exec |
| `3` | execute-irreversible | push, deploy, spend money, physical actuation with real consequences |

Not monotonic over the agent's life. Dropping from 2 to 1 after an
incident is normal, that's not a "downgrade" the way semver would treat
it. If you're building a supervisor for a fleet of agents, this is the
field you check before letting anything near prod. Full stop, doesn't
matter what mind or capability say.

## policy

Opaque id, hash or whatever the vendor hands you, for the guardrail ruleset
currently active. No ordering. Exists because two agents can match on
mind, capability, and autonomy and still behave differently, this is what
tells them apart, and it's what makes a guardrail change auditable without
it looking like a model swap happened.
