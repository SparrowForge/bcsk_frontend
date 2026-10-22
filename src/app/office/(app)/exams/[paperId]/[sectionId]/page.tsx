import Link from "next/link";
import { notFound } from "next/navigation";
import { requireMenu } from "@/lib/auth";
import { ApiError, teaching } from "@/services";
import { TeachingTabs } from "@/components/office/TeachingTabs";
import { formatDate } from "@/lib/dates";
import { SHEET } from "../../sheet-status";
import { MarksGrid } from "./MarksGrid";

/** LMS F2: one section's mark sheet for one paper. */
export default async function MarksPage({ params }: { params: Promise<{ paperId: string; sectionId: string }> }) {
  const session = await requireMenu("office.classes");
  const canWrite = session.menus.find((m) => m.key === "office.classes")!.flags.insert;
  const { paperId, sectionId } = await params;
  const grid = await teaching.marks(Number(paperId), Number(sectionId)).catch((e) => {
    if (e instanceof ApiError && [403, 404].includes(e.status)) notFound();
    throw e;
  });
  const open = grid.status === "NOT_STARTED" || grid.status === "DRAFT";

  return (
    <div className="max-w-4xl space-y-6">
      <TeachingTabs />
      <div>
        <Link href="/office/exams" className="text-xs font-bold text-green-mid hover:underline">← Exams & marks</Link>
        <div className="flex flex-wrap items-center gap-3 mt-1">
          <h1 className="font-display text-2xl font-semibold text-green">
            {grid.paper.subject}, section {grid.section.name}
          </h1>
          <span className={`text-[10px] font-extrabold uppercase rounded-full px-2 py-0.5 ${SHEET[grid.status].tone}`}>{SHEET[grid.status].label}</span>
        </div>
        <p className="text-xs text-ink-soft mt-1">
          {grid.paper.exam.name} · sat {formatDate(grid.paper.date)} · full marks {grid.paper.fullMarks}, pass {grid.paper.passMarks}
          {grid.submittedAt ? ` · submitted ${formatDate(grid.submittedAt)}` : ""}
        </p>
      </div>

      {grid.reopenReason && (
        <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900" role="status">
          <span className="font-bold">Reopened by the Head Master:</span> {grid.reopenReason}
        </p>
      )}
      {!open && (
        <p className="rounded-xl border border-line bg-white p-3 text-sm text-ink-soft">
          {grid.status === "LOCKED"
            ? "The results are approved, so these marks are final."
            : "These marks are submitted. If something needs correcting, ask the Head Master to reopen the sheet."}
        </p>
      )}

      <MarksGrid
        paperId={grid.paper.id}
        sectionId={grid.section.id}
        fullMarks={grid.paper.fullMarks}
        passMarks={grid.paper.passMarks}
        editable={open && canWrite}
        students={grid.students.map((s) => ({
          userId: s.student.id, name: s.student.name, studentId: s.student.studentProfile?.studentId ?? "",
          rollNo: s.rollNo, obtained: s.obtained, isAbsent: s.isAbsent,
        }))}
      />
    </div>
  );
}
