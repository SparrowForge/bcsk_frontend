import Link from "next/link";
import { AbacusNav } from "./AbacusNav";
import { PhotoBanner } from "@/components/site/PhotoBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Abacus Programme", template: "%s | BCSK Abacus" },
  description:
    "Eight levels of soroban training at BCSK, from a child's first beads to fast mental arithmetic, taught online with a virtual abacus and maths games.",
};

/**
 * 3.8.3 Abacus programme (FR-ABC-01..09), laid out after the school's October 2026 mockup:
 * a photo banner, the programme's own tab bar (Home, All About Abacus, Syllabus, Book, Online
 * Class, Fun Abacus), each tab's content, and one closing band asking families to enrol.
 */
export default function AbacusLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PhotoBanner
        image="/images/banners/abacus-hero.jpg"
        imagePosition="40% 30%"
        overlay={
          // A card rather than bare lettering: the photo is busy right where the mockup puts
          // the slogan, and green type over it could not be read.
          <p
            aria-hidden
            className="absolute right-4 top-4 rotate-[-6deg] rounded-2xl bg-white/90 px-4 py-2.5 text-right font-display text-xl font-semibold italic leading-tight text-green shadow-lg sm:right-6 sm:top-6 sm:text-2xl"
          >
            Small Beads
            <br />
            Big Dreams
            <span className="ml-auto mt-1.5 block h-1 w-20 rounded-full bg-crimson" />
          </p>
        }
      >
        <p className="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.2em] text-green">
          <span aria-hidden className="h-0.5 w-8 rounded-full bg-crimson" />
          Our Programs
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] text-green sm:text-5xl lg:text-[3.4rem]">
          Abacus Program
        </h1>
        <p className="mt-3 font-display text-xl leading-snug text-green-mid sm:text-2xl">
          Build Strong Math Skills,
          <br />
          Develop a Brighter Mind
        </p>
        <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-ink-soft">
          Our Abacus program helps children improve concentration, memory, and quick calculation skills while making
          learning fun and engaging.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/apply/special?course=abacus"
            className="press inline-flex items-center gap-2 rounded-lg bg-crimson px-6 py-2.5 text-sm font-bold text-white hover:bg-crimson-deep"
          >
            Enroll Now <span aria-hidden>→</span>
          </Link>
          <Link
            href="/courses/abacus/about"
            className="inline-flex items-center rounded-lg border-2 border-green px-6 py-2 text-sm font-bold text-green hover:bg-green-soft"
          >
            Learn More
          </Link>
        </div>
      </PhotoBanner>

      <div className="mx-auto max-w-7xl px-4 mt-4">
        <AbacusNav />
      </div>

      {children}

      <section className="mx-auto max-w-7xl px-4 mt-16">
        <div className="relative isolate flex flex-col items-center gap-6 overflow-hidden rounded-3xl bg-green px-6 py-10 text-center sm:px-12 md:flex-row md:justify-between md:text-left">
          {/* A row of beads bleeding off the left edge: the band's one picture. */}
          <div aria-hidden className="absolute -left-6 top-1/2 -z-10 hidden -translate-y-1/2 gap-2 opacity-25 lg:flex">
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i} className="h-7 w-10 bg-abacus [clip-path:polygon(0_50%,24%_0,76%_0,100%_50%,76%_100%,24%_100%)]" />
            ))}
          </div>
          <div className="lg:pl-80">
            <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">Give Your Child the Power of Numbers</h2>
            <p className="mt-1.5 text-sm text-white/80">Join our Abacus Program at Bangladesh Community School, Korea.</p>
          </div>
          <Link
            href="/apply/special?course=abacus"
            className="press shrink-0 rounded-lg bg-crimson px-8 py-3 text-sm font-bold text-white hover:bg-crimson-deep"
          >
            Enroll Now →
          </Link>
        </div>
      </section>
    </>
  );
}
