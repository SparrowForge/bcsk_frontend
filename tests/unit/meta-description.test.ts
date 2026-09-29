import { describe, it, expect } from "vitest";
import { metaDescription } from "@/lib/meta-description";

describe("metaDescription", () => {
  it("skips the page's own heading", () => {
    expect(metaDescription("<h2>About Us</h2><p>BCSK is the first school.</p>")).toBe("BCSK is the first school.");
  });

  it("keeps a bold-paragraph subhead as a label for the line after it", () => {
    const html = "<h2>Weekly Schedule</h2><p><strong>Saturday</strong></p><p>10:00 AM – 4:00 PM.</p>";
    expect(metaDescription(html)).toBe("Saturday: 10:00 AM – 4:00 PM.");
  });

  it("does not double a colon the subhead already has", () => {
    expect(metaDescription("<p><strong>Note:</strong></p><p>Fees are per semester.</p>")).toBe("Note: Fees are per semester.");
  });

  it("drops tables, which read as noise in a snippet", () => {
    expect(metaDescription("<p>Dates below.</p><table><tr><td>March 1</td></tr></table>")).toBe("Dates below.");
  });

  it("falls back to all the text when there is nothing but headings", () => {
    expect(metaDescription("<h2>Coming soon</h2>")).toBe("Coming soon");
  });

  it("decodes entities once, without double-decoding", () => {
    expect(metaDescription("<p>Qur&#x27;an &amp; Deen &amp;lt;3</p>")).toBe("Qur'an & Deen &lt;3");
  });

  it("cuts at a word boundary with an ellipsis", () => {
    const out = metaDescription(`<p>${"word ".repeat(60)}</p>`);
    expect(out.length).toBeLessThanOrEqual(156);
    expect(out).toMatch(/word…$/);
  });
});
