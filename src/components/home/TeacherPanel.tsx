import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { PublicTeacher } from "@/services";
import { SectionBar } from "./SectionBar";
import { CardSlider } from "./CardSlider";

/**
 * The teacher band, between the live boards and School Overview — four faces at a time, the
 * rest arriving one at a time as the strip advances (the loop, pause control and reduced-
 * motion handling all live in `CardSlider`).
 *
 * It wears the same band bar as the sections around it rather than sitting as a panel inside
 * one: the staff are a subject of their own, not a footnote to how the school is managed.
 */
export function TeacherPanel({ teachers, t }: { teachers: PublicTeacher[]; t: Dictionary }) {
  if (teachers.length === 0) return null;

  return (
    <section className="logo-shade logo-shade-left mx-auto max-w-7xl px-4 mt-12">
      <SectionBar>{t.home.teacherPanel}</SectionBar>
      <CardSlider
        t={t}
        label={t.home.teacherPanel}
        basis="basis-full min-[420px]:basis-1/2 md:basis-1/3 lg:basis-1/4"
        items={teachers.map((tp, i) => ({
          key: tp.teacherId,
          node: <TeacherCard teacher={tp} index={i} t={t} />,
        }))}
        footer={
          <Link
            href="/bcsk/teachers"
            // The deeper green, not the link green: this band carries the logo shade, and
            // `--green-mid` over the mark's darkest point is 3.8:1. `--green` is 4.9:1 there.
            className="text-green text-xs font-bold hover:underline underline-offset-4"
          >
            {t.home.viewTeachers} →
          </Link>
        }
      />
    </section>
  );
}

/**
 * One face. The photograph is the point of the card, so it is large and ringed — a parent
 * should be able to recognise the teacher at the school gate from it.
 */
function TeacherCard({ teacher, index, t }: { teacher: PublicTeacher; index: number; t: Dictionary }) {
  return (
    <article className="hover-lift flex h-full flex-col items-center rounded-2xl border border-green-mid/15 bg-white px-5 pt-7 pb-6 text-center">
      {teacher.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={teacher.photoUrl}
          alt={teacher.name}
          loading="lazy"
          className="h-32 w-32 rounded-full object-cover ring-4 ring-white shadow-[0_12px_24px_-14px_rgba(0,77,57,0.9)]"
        />
      ) : (
        <div
          className={`flex h-32 w-32 items-center justify-center rounded-full font-display text-3xl font-semibold ring-4 ring-white shadow-[0_12px_24px_-14px_rgba(0,77,57,0.9)] ${
            ["bg-green text-white", "bg-green-mid text-white", "bg-green-deep text-white", "bg-crimson text-white"][
              index % 4
            ]
          }`}
          aria-hidden
        >
          {teacher.name.split(" ").slice(-2).map((w) => w[0]).join("")}
        </div>
      )}
      <h3 className="mt-5 font-display text-[1.05rem] font-bold leading-snug text-green">{teacher.name}</h3>
      {teacher.designation && (
        <p className="mt-1 text-[11px] font-extrabold uppercase tracking-wide text-crimson-ink">
          {teacher.designation}
        </p>
      )}
      {teacher.subjects && (
        <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
          <span className="font-bold text-green">{t.common.teacher}:</span> {teacher.subjects}
        </p>
      )}
    </article>
  );
}
