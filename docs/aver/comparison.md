# Comparing versions

Field meanings are in [fields.md](fields.md). This is just about how to
compare two version strings.

Only autonomy is ordered. Everything else is equal-or-not:

- vendor:mind – equal or not
- capability – equal or not (tells you the sets differ, not how)
- autonomy – `0 < 1 < 2 < 3`, fine to use in a `>=`/`<=` check
- policy – equal or not

A "can agent X run task T" check:

```
X.autonomy >= T.required_autonomy
  AND T.required_tools ⊆ X.capability_manifest
  AND X.vendor:mind IN T.allowed_minds   (if you care)
```

Don't use mind as a stand-in for capability. Check the manifest.

## Capability manifest

`capability` in the version string is a hash. The manifest is what it's a
hash of:

```json
{
  "version": "v anthropic:sonnet-5.9f3c21a0.2-a3f9c1",
  "capability_manifest": [
    "read_file", "edit_file", "bash_exec", "web_search"
  ]
}
```

capability should equal `hex(sha256(join(sort(capability_manifest), ",")))[:8]`.
Anyone consuming a version string can recompute this instead of trusting
it blind.

Robots: swap tool names for actuator/sensor names. `gripper_left`,
`lidar_front`, `drive_base`, whatever the thing has.
