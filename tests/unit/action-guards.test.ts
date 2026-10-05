import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

/**
 * Server Actions compile to public HTTP endpoints, so each one must check the caller itself:
 * the page or layout guard above it does not run when an action is invoked directly. This
 * walks every `actions.ts` in the student, teacher and admin panels and fails if an exported
 * async function does not start by calling a `require*` guard.
 */
const ROOT = join(process.cwd(), "src", "app");
const PANELS: Record<string, RegExp> = {
  "classroom": /await requireStudent\(\)/,
  "office": /await requireTeacher\(\)/,
  // Admin actions use a capability guard; plain requireAdmin() is only for shared screens.
  "admin": /await require(Permission|SuperAdmin|Admin)\(/,
};

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : name === "actions.ts" ? [p] : [];
  });
}

/** [name, body] for each exported async function, up to its closing brace at column 0. */
function exportedFunctions(src: string): [string, string][] {
  const out: [string, string][] = [];
  const re = /^export async function (\w+)\([\s\S]*?^\}/gm;
  for (const m of src.matchAll(re)) out.push([m[1]!, m[0]]);
  return out;
}

describe("every panel Server Action checks its caller", () => {
  for (const [panel, guard] of Object.entries(PANELS)) {
    const files = walk(join(ROOT, panel));
    it(`${panel}: finds actions to check`, () => expect(files.length).toBeGreaterThan(0));
    for (const file of files) {
      const rel = relative(ROOT, file).split(sep).join("/");
      for (const [name, body] of exportedFunctions(readFileSync(file, "utf8"))) {
        it(`${rel} › ${name}`, () => expect(body).toMatch(guard));
      }
    }
  }
});
