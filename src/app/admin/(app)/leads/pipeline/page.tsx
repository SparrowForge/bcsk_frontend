import Link from "next/link";
import { can, requirePermission } from "@/lib/auth";
import { leads } from "@/services";
import { OPEN_STAGE_KEYS, STAGES, formatDateTime, isOverdue } from "@/lib/leads";
import { StageSelect } from "./StageSelect";

/**
 * The pipeline board: one column per open stage. A card moves by its stage menu rather than by
 * drag-and-drop, which works the same on a phone and needs no client-side board state. Won and
 * lost leads leave the board; they stay in the list and the reports.
 */
export default async function PipelinePage() {
  const session = await requirePermission("leads:read");
  const canManage = can(session, "leads:manage");
  const all = await leads.board();

  const columns = OPEN_STAGE_KEYS.map((key) => ({
    stage: STAGES.find((s) => s.key === key)!,
    cards: all.filter((l) => l.stage === key),
  }));

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
      {columns.map(({ stage, cards }) => (
        <section key={stage.key} className="w-72 shrink-0 snap-start" aria-label={stage.label}>
          <h2 className="flex items-center gap-2 mb-3 text-sm font-bold text-ink">
            <span className={`text-[11px] font-bold rounded-full px-2.5 py-1 ${stage.tone}`}>{stage.label}</span>
            <span className="text-ink-soft font-normal">{cards.length}</span>
          </h2>
          <div className="space-y-3">
            {cards.length === 0 && <p className="text-xs text-ink-soft bg-mist rounded-xl p-4">Empty.</p>}
            {cards.map((l) => (
              <article key={l.id} className="bg-white rounded-xl border border-line p-4">
                <Link href={`/admin/leads/${l.id}`} className="font-bold text-sm text-ink hover:text-green-mid">{l.name}</Link>
                <p className="text-xs text-ink-soft mt-0.5">{l.course?.name ?? "No course yet"}</p>
                <p className="text-xs text-ink-soft">{l.assignedTo?.name ?? "Unassigned"}</p>
                {l.nextFollowUpAt && (
                  <p className={`text-xs mt-1 ${isOverdue(l.nextFollowUpAt, l.stage) ? "text-red-600 font-bold" : "text-ink-soft"}`}>
                    Follow up {formatDateTime(l.nextFollowUpAt)}
                  </p>
                )}
                {canManage && <StageSelect leadId={l.id} stage={l.stage} />}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
