import type { Metadata } from "next";
import { headers } from "next/headers";
import { Fraunces, Nunito_Sans, Noto_Sans_KR } from "next/font/google";
import localFont from "next/font/local";
import { getLang } from "@/lib/i18n";
import { MOTION_BOOTSTRAP } from "@/lib/motion";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
});
const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800"],
});
/**
 * SolaimanLipi, self-hosted — the face Bangladeshi readers expect, and not on Google Fonts,
 * so the two weights live in `src/fonts` and ship with the build. Self-hosting also keeps
 * the CSP in `src/proxy.ts` closed: no third-party font origin to allowlist.
 *
 * `size-adjust` is how the Bangla text gets its extra 2px. Bumping `font-size` instead
 * would not work here: `:lang(bn)` matches by inheritance, so a `calc(1em + 2px)` would
 * compound once per nesting level, and a root bump would move only the rem-based sizes and
 * leave every `text-[13px]` behind. This scales the glyphs inside the em box instead — one
 * ratio, applied wherever a Bangla glyph is drawn, including Bangla words sitting inside an
 * English sentence, where the Latin face beside them keeps its own size. 112.5% is +2px at
 * the 16px body size and the same proportion everywhere else.
 */
const solaimanLipi = localFont({
  src: [
    { path: "../fonts/solaimanlipi-normal-v1.0.woff2", weight: "400", style: "normal" },
    { path: "../fonts/solaimanlipi-bold-v1.0.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-bangla",
  display: "swap",
  declarations: [{ prop: "size-adjust", value: "112.5%" }],
});
const notoKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-korean",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Bangladesh Community School, Korea (BCSK)",
    template: "%s | BCSK",
  },
  description:
    "The first Bangladeshi community school in South Korea — NCTB curriculum from Pre-Primary to Class 5, Qur'an & Islamic studies, IELTS for Kids, Abacus, and more.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  // SEC-8: `src/proxy.ts` sends a nonce-based CSP with `strict-dynamic`, so an inline script
  // without this nonce is simply not executed — silently, and only once deployed.
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html
      lang={lang}
      className={`${fraunces.variable} ${nunito.variable} ${solaimanLipi.variable} ${notoKr.variable}`}
      // The bootstrap below sets `data-motion` here before React hydrates; React compares the
      // root element's attributes and would otherwise report that as a mismatch on every load.
      suppressHydrationWarning
    >
      <head>
        {/* Arms the scroll-reveal styles before the first paint — see `lib/motion.ts`. The
            `type` switch is Next's own recipe for an inline script: it executes as the
            browser parses the server HTML, and is inert (and silent) on the client, where
            React otherwise warns that a rendered <script> will never run. */}
        <script
          type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: MOTION_BOOTSTRAP }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
