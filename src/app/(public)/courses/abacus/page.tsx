import Link from "next/link";
import { site } from "@/services";
import { VirtualAbacus } from "./VirtualAbacus";

/** Abacus Home: the Virtual Abacus Tool (FR-ABC-06) and a way into every tab. */
export default async function AbacusHomePage() {
  const course = await site.course("abacus");

  const tiles = [
    { href: "/courses/abacus/about", title: "All About Abacus", text: "What it is, its history, and how the beads work.", icon: "📖" },
    { href: "/courses/abacus/syllabus", title: "Syllabus", text: `${course?.levels.length ?? 8} levels, from first beads to mental maths.`, icon: "🧭" },
    { href: "/courses/abacus/books", title: "Book", text: "A Student Book and a Work Book for every level.", icon: "📚" },
    { href: "/courses/abacus/online-class", title: "Online Class", text: "Weekly live classes and recorded lessons.", icon: "🎥" },
    { href: "/courses/abacus/fun", title: "Fun Abacus", text: "Nine mental-maths games — save your best scores.", icon: "🎮" },
  ];

  return (
    <>
      <section id="virtual-abacus" className="mx-auto max-w-7xl px-4 mt-12">
        <div className="text-center mb-6">
          <h2 className="inline-block bg-abacus text-ink font-display text-2xl sm:text-3xl font-semibold rounded-lg px-5 py-1.5">
            Virtual Abacus Tool
          </h2>
          <p className="mt-3 text-sm text-ink-soft max-w-2xl mx-auto">
            A real soroban in your browser. Move beads to the beam to count them, hide the number to test yourself, or
            press <strong>Challenge me!</strong> for a number to build.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="max-w-full">
            <VirtualAbacus />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 mt-16">
        <h2 className="font-display text-3xl font-semibold text-ink mb-2">Explore the programme</h2>
        {course?.description && <p className="text-sm text-ink-soft mb-6 max-w-2xl">{course.description}</p>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {tiles.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group bg-white border border-line hover:border-abacus rounded-2xl p-5 transition-colors"
            >
              <span className="w-11 h-11 rounded-xl bg-abacus-soft flex items-center justify-center text-xl" aria-hidden>
                {t.icon}
              </span>
              <h3 className="mt-3 font-bold text-green group-hover:text-green-mid">{t.title} →</h3>
              <p className="mt-1 text-xs text-ink-soft leading-relaxed">{t.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
