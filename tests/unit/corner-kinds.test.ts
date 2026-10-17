import { describe, it, expect } from "vitest";
import { kindLook, kindTitle } from "../../src/lib/corner-kinds";
import { dictionaries } from "../../src/lib/i18n/dictionaries";

/**
 * Student Corner kinds are open-ended (October 2026): the admin types them and the backend
 * stores a key. The homepage, the Student Corner page and the admin list all label and colour
 * them through `kindLook`, so a kind nobody planned for must still read as a word and keep one
 * colour everywhere.
 */
const en = dictionaries.en;

describe("Student Corner kinds", () => {
  it("translates the kinds the site knows", () => {
    expect(kindLook("POEM", en).label).toBe(en.home.kindPoem);
    expect(kindLook("HANDICRAFT", dictionaries.bn).label).toBe(dictionaries.bn.home.kindHandicraft);
  });

  it("title-cases a kind it has never seen", () => {
    expect(kindTitle("SCIENCE_PROJECTS")).toBe("Science Projects");
    expect(kindLook("SCIENCE_PROJECTS", en).label).toBe("Science Projects");
  });

  it("gives an unknown kind the same colour every time", () => {
    expect(kindLook("ROBOTICS", en)).toEqual(kindLook("ROBOTICS", en));
    expect(kindLook("ROBOTICS", en).solid).toMatch(/text-white/);
  });

  it("leaves a kind typed in Bangla readable", () => {
    expect(kindLook("হস্তশিল্প", en).label).toBe("হস্তশিল্প");
  });
});
