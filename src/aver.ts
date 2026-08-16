import { createHash } from "node:crypto";

export type Autonomy = 0 | 1 | 2 | 3;

export interface AverParts {
  vendor: string;
  mind: string;
  capability: string; // 8 hex digits
  autonomy: Autonomy;
  policy: string;
}

const VERSION_RE =
  /^v([a-zA-Z0-9-]+):([a-zA-Z0-9.-]+)\.([0-9a-fA-F]{8})\.([0-3])-([a-zA-Z0-9]+)$/;

export function hashManifest(manifest: string[]): string {
  const joined = [...manifest].sort().join(",");
  return createHash("sha256").update(joined).digest("hex").slice(0, 8);
}

export function hashPolicy(policySource: string): string {
  return createHash("sha256").update(policySource).digest("hex").slice(0, 6);
}

export function format(parts: AverParts): string {
  return `v${parts.vendor}:${parts.mind}.${parts.capability}.${parts.autonomy}-${parts.policy}`;
}

export function parse(version: string): AverParts {
  const match = VERSION_RE.exec(version);
  if (!match) {
    throw new Error(`not a valid AVER string: ${version}`);
  }
  const [, vendor, mind, capability, autonomy, policy] = match;
  return {
    vendor: vendor!,
    mind: mind!,
    capability: capability!,
    autonomy: Number(autonomy) as Autonomy,
    policy: policy!,
  };
}

export function verifyCapability(parts: AverParts, manifest: string[]): boolean {
  return parts.capability === hashManifest(manifest);
}

export function autonomyAtLeast(version: string, required: Autonomy): boolean {
  return parse(version).autonomy >= required;
}
