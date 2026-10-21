import type { Metadata } from "next";
import { academic } from "@/services";
import { PhotoBanner, BannerRule } from "@/components/site/PhotoBanner";
import { ClassCard } from "@/components/academic/ClassCard";
import { reveal } from "@/lib/motion";

export const metadata: Metadata = {
  title: "All General Classes",
  description: "BCSK's general classes from Pre-Primary upward: what each class learns and the books it uses.",
};

/** Academic > All General Classes: every class the school runs, as cards. Classes come from the admin panel. */
export default async function GeneralClassesPage() {
  const classes = await academic.classes();

  return (
    <>
      <PhotoBanner image="/images/academic/classes-banner.jpg" imagePosition="75% center">
        <p className="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-[0.2em] text-crimson-ink">
          <span aria-hidden className="h-0.5 w-6 rounded-full bg-crimson" />
          Our Programs
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight tracking-tight text-green sm:text-5xl lg:text-6xl">
          All General Classes
        </h1>
        <BannerRule />
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-soft">
          We provide quality education for students from Pre-Primary upward, building a strong foundation for a
          brighter future.
        </p>
      </PhotoBanner>

      <section className="mx-auto max-w-7xl px-4 mt-12 pb-4">
        {classes.length === 0 ? (
          <p className="rounded-2xl border border-line bg-white p-8 text-center text-ink-soft">
            Class information is being prepared. Please check back soon.
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((c, i) => (
              <li key={c.id} {...reveal("up", i % 3, 90)}>
                <ClassCard c={c} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
