#!/usr/bin/env bun
import { readFileSync, writeFileSync } from "node:fs";
import {
  format,
  hashManifest,
  hashPolicy,
  parse,
  verifyCapability,
  type Autonomy,
} from "./aver.js";

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
}

function readManifest(path: string): string[] {
  return JSON.parse(readFileSync(path, "utf8"));
}

function usage(): never {
  console.error(
    [
      "usage:",
      "  aver generate --vendor <v> --mind <m> --manifest <file.json> --autonomy <0-3> --policy-source <file> [--out version.json]",
      "  aver parse <version>",
      "  aver verify <version> --manifest <file.json>",
    ].join("\n"),
  );
  process.exit(1);
}

const [cmd, ...rest] = process.argv.slice(2);

switch (cmd) {
  case "generate": {
    const vendor = flag(rest, "vendor");
    const mind = flag(rest, "mind");
    const manifestPath = flag(rest, "manifest");
    const autonomyRaw = flag(rest, "autonomy");
    const policySourcePath = flag(rest, "policy-source");
    if (!vendor || !mind || !manifestPath || !autonomyRaw || !policySourcePath) {
      usage();
    }
    const autonomy = Number(autonomyRaw);
    if (![0, 1, 2, 3].includes(autonomy)) {
      console.error("--autonomy must be 0, 1, 2, or 3");
      process.exit(1);
    }
    const manifest = readManifest(manifestPath);
    const policySource = readFileSync(policySourcePath, "utf8");
    const version = format({
      vendor,
      mind,
      capability: hashManifest(manifest),
      autonomy: autonomy as Autonomy,
      policy: hashPolicy(policySource),
    });
    const out = flag(rest, "out");
    if (out) {
      writeFileSync(out, JSON.stringify({ version, capability_manifest: manifest }, null, 2));
    }
    console.log(version);
    break;
  }
  case "parse": {
    const [version] = rest;
    if (!version) usage();
    console.log(JSON.stringify(parse(version), null, 2));
    break;
  }
  case "verify": {
    const [version] = rest;
    const manifestPath = flag(rest, "manifest");
    if (!version || !manifestPath) usage();
    const manifest = readManifest(manifestPath);
    const ok = verifyCapability(parse(version), manifest);
    console.log(ok ? "ok: capability hash matches manifest" : "mismatch: capability hash does not match manifest");
    process.exit(ok ? 0 : 1);
  }
  default:
    usage();
}
