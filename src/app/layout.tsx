import type { Metadata } from "next";
import { headers } from "next/headers";
import { Fraunces, Nunito_Sans, Hind_Siliguri, Noto_Sans_KR } from "next/font/google";
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
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  variable: "--font-bangla",
  weight: ["400", "500", "600", "700"],
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
      className={`${fraunces.variable} ${nunito.variable} ${hindSiliguri.variable} ${notoKr.variable}`}
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
