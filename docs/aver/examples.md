# Examples

```
v anthropic:sonnet-5.9f3c21a0.2-a3f9c1        # this session
v openai:gpt-5.51e0d8ac.1-8b21e0               # different vendor, different toolset
v boston-dynamics:atlas-3.7ac209f4.3-f00d42    # a robot, capability hashes actuators/sensors
```

Guardrail tightened after an incident, model and tools untouched:

```
v anthropic:sonnet-5.9f3c21a0.2-a3f9c1  →  v anthropic:sonnet-5.9f3c21a0.1-7c02de
```
autonomy 2→1, policy changed, capability hash unchanged since the toolset
didn't move.

One tool swapped for another, count stays the same:

```
v anthropic:sonnet-5.9f3c21a0.2-a3f9c1  →  v anthropic:sonnet-5.2e77b613.2-a3f9c1
```
web_search replaced with web_fetch. A count misses this. Hash doesn't.
See [fields.md](fields.md#capability) for why capability is a hash and not
a count.
