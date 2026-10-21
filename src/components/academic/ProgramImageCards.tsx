import Link from "next/link";
import { reveal } from "@/lib/motion";

/**
 * The four programmes as picture cards (Academic Curriculum design, Oct 2026). The pictures are
 * the school's mockups and carry the programme name in the artwork, so the link's accessible
 * name comes from `aria-label` rather than from visible text.
 */
const PROGRAMS = [
  { title: "All General Classes", href: "/academic/classes", image: "/images/academic/program-general-classes.jpg" },
  { title: "IELTS for Kids", href: "/courses/ielts-for-kids", image: "/images/academic/program-ielts.jpg" },
  { title: "Islamic Education in Korea", href: "/courses/deen", image: "/images/academic/program-deen.jpg" },
  { title: "Abacus", href: "/courses/abacus", image: "/images/academic/program-abacus.jpg" },
];

export function ProgramImageCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 mt-12 pb-4">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-crimson-ink">Our Programs</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-green sm:text-4xl">Choose a programme</h2>
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {PROGRAMS.map((p, i) => (
          <li key={p.href} {...reveal("up", i, 90)}>
            <Link
              href={p.href}
              aria-label={p.title}
              className="group block overflow-hidden rounded-2xl shadow-[0_14px_30px_-18px_rgba(0,77,57,0.55)] ring-1 ring-black/5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_-20px_rgba(0,77,57,0.7)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green/40 motion-reduce:transform-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt=""
                className="aspect-[247/419] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
