import Link from "next/link";
import { requireMenu } from "@/lib/auth";
import { teaching } from "@/services";
import type { TeacherPaper } from "@/services/types";
import { TeachingTabs } from "@/components/office/TeachingTabs";
import { formatDate } from "@/lib/dates";
import { schoolToday } from "@/lib/school-time";
import { SHEET } from "./sheet-status";

/**
 * LMS F2: the exam papers this teacher marks this term - as the subject's teacher in a section,
 * or as the paper's named examiner - with each section's mark sheet and where it stands.
 */
export default async function TeacherExamsPage() {
  await requireMenu("office.classes");
  const papers = await teaching.papers();
  const today = schoolToday();
  const exams = [...new Map(papers.map((p) => [p.exam.id, p.exam])).values()];

  return (
    <div className="max-w-4xl">
      <TeachingTabs />
      <h1 className="font-display text-2xl font-semibold text-green mb-1">Exams & marks</h1>
      <p className="text-sm text-ink-soft mb-6">
        Enter marks once a paper has been sat; save a draft as often as you like, then submit the sheet when every student has marks or is marked absent.
        A submitted sheet can only be changed if the Head Master reopens it.
      </p>

      {exams.length === 0 ? (
        <p className="bg-white rounded-2xl border border-line p-6 text-sm text-ink-soft">No scheduled exam this term has a paper for you.</p>
      ) : (
        <div className="space-y-8">
          {exams.map((exam) => (
            <section key={exam.id}>
              <h2 className="text-xs font-extrabold uppercase tracking-wide text-crimson-ink mb-3">{exam.name}</h2>
              <ul className="bg-white rounded-2xl border border-line divide-y divide-line overflow-hidden">
                {papers.filter((p) => p.exam.id === exam.id).map((p) => <PaperRow key={p.id} p={p} sat={p.date.slice(0, 10) <= today} />)}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function PaperRow({ p, sat }: { p: TeacherPaper; sat: boolean }) {
  return (
    <li className="p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm">
          <span className="font-bold text-ink">{p.subject.name}</span>{" "}
          <span className="text-ink-soft">· {p.courseLevel.name}</span>
        </p>
        <p className="text-xs text-ink-soft">
          {formatDate(p.date, "en", { weekday: "short", day: "numeric", month: "short" })} · {p.startTime}{p.endTime ? `–${p.endTime}` : ""}
          {p.room ? ` · ${p.room}` : ""} · full {p.fullMarks}, pass {p.passMarks}
        </p>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {p.sections.length === 0 && <span className="text-xs text-ink-soft">No section of yours sits this paper.</span>}
        {p.sections.map((s) => (
          <span key={s.sectionId} className="inline-flex items-center gap-2 rounded-xl border border-line px-3 py-1.5">
            <span className="text-xs font-bold text-ink">Section {s.section}</span>
            <span className={`text-[10px] font-extrabold uppercase rounded-full px-2 py-0.5 ${SHEET[s.status].tone}`}>{SHEET[s.status].label}</span>
            {sat ? (
              <Link href={`/office/exams/${p.id}/${s.sectionId}`} className="text-xs font-bold text-green-mid hover:underline">
                {s.status === "NOT_STARTED" || s.status === "DRAFT" ? "Enter marks" : "View"}
              </Link>
            ) : (
              <span className="text-[11px] text-ink-soft">not sat yet</span>
            )}
            {(s.status === "SUBMITTED" || s.status === "LOCKED") && (
              <Link href={`/office/results/${p.exam.id}/${s.sectionId}`} className="text-xs font-bold text-green-mid hover:underline">Results</Link>
            )}
          </span>
        ))}
      </div>
    </li>
  );
}
