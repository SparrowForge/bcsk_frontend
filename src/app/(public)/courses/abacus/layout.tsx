import Link from "next/link";
import { AbacusNav } from "./AbacusNav";
import { SorobanArt } from "./SorobanArt";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Abacus Programme", template: "%s | BCSK Abacus" },
};

/**
 * 3.8.3 Abacus programme (FR-ABC-01..09). The school's design is a small site of its own:
 * one green banner and an orange tab bar shared by Home, All About Abacus, Syllabus, Book,
 * Online Class and Fun Abacus.
 */
export default function AbacusLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-6">
        <div className="relative bg-green rounded-3xl px-6 sm:px-10 pt-10 pb-6 overflow-hidden">
          <div className="absolute -left-16 -bottom-20 w-64 h-64 rounded-full bg-green-deep/60" aria-hidden />
          <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <p className="text-xs font-extrabold tracking-[0.2em] uppercase text-green-soft">BCSK Abacus Programme</p>
              <h1 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-abacus leading-tight">
                Welcome To Our Abacus Programme
              </h1>
              <p className="mt-2 font-display text-xl sm:text-2xl text-white">Where Math Becomes an Adventure</p>
              <p className="mt-4 text-sm text-white/75 max-w-lg leading-relaxed">
                Eight levels of soroban training — from a child’s first beads to lightning-fast mental arithmetic —
                taught online by BCSK teachers.
              </p>
              <Link
                href="/apply/special?course=abacus"
                className="inline-block mt-6 bg-crimson hover:bg-crimson-deep text-white font-bold rounded-lg px-6 py-2.5 text-sm transition-colors"
              >
                Join the Abacus programme
              </Link>
            </div>
            <div className="hidden lg:block justify-self-end">
              <div className="relative bg-white/10 rounded-2xl p-4 rotate-[-3deg]">
                <SorobanArt value={2026} rods={9} className="w-72 lg:w-80 h-auto drop-shadow-xl" />
                <span className="absolute -top-3 -right-3 bg-abacus text-ink font-extrabold text-xs rounded-full px-3 py-1.5 rotate-[6deg] shadow">
                  Mental Math!
                </span>
              </div>
            </div>
          </div>
          <div className="relative mt-8">
            <AbacusNav />
          </div>
        </div>
      </section>

      {children}

      <section className="mx-auto max-w-7xl px-4 mt-16">
        <div className="bg-green rounded-3xl px-6 sm:px-12 py-12 text-center">
          <h2 className="font-display text-3xl font-semibold text-white">Ready for the adventure?</h2>
          <p className="mt-2 text-white/70 text-sm">Eight levels from first beads to full mental arithmetic.</p>
          <Link
            href="/apply/special?course=abacus"
            className="inline-block mt-6 bg-crimson hover:bg-crimson-deep text-white font-bold rounded-lg px-8 py-3 text-sm transition-colors"
          >
            Apply for Abacus
          </Link>
        </div>
      </section>
    </>
  );
}
