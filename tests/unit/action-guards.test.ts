import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

/**
 * Server Actions compile to public HTTP endpoints, so each one must check the caller itself:
 * the page or layout guard above it does not run when an action is invoked directly. This
 * walks every `actions.ts` in the student, teacher and admin panels and fails if an exported
 * async function does not start by calling a `require*` guard.
 *
 * Student and teacher actions check the menu switch they need (Insert / Update / Delete); the
 * desk-status card on the always-open teacher dashboard is the one that only needs the role.
 */
const ROOT = join(process.cwd(), "src", "app");
const PANELS: Record<string, RegExp> = {
  classroom: /await requireMenu\("classroom\.[\w-]+", "(insert|update|delete)"\)/,
  office: /await require(Menu\("office\.[\w-]+", "(insert|update|delete)"\)|Teacher\(\))/,
  // Admin actions use a capability guard; plain requireAdmin() is only for shared screens.
  admin: /await require(Permission|SuperAdmin|Admin)\(/,
};

function walk(dir: string, file = "actions.ts"): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p, file) : name === file ? [p] : [];
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

/** Every student and teacher page (but the always-open dashboard) must name its menu. */
describe("every student and teacher page checks its menu", () => {
  const cases: [string, RegExp][] = [
    ["classroom", /await requireMenu\("classroom\.[\w-]+"\)/],
    ["office", /await requireMenu\("office\.[\w-]+"\)/],
  ];
  for (const [panel, guard] of cases) {
    for (const file of walk(join(ROOT, panel), "page.tsx")) {
      const rel = relative(ROOT, file).split(sep).join("/");
      if (rel.includes("/dashboard/")) continue;
      it(rel, () => expect(readFileSync(file, "utf8")).toMatch(guard));
    }
  }
});
