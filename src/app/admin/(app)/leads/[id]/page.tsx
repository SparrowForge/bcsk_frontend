import Link from "next/link";
import { notFound } from "next/navigation";
import { can, requirePermission } from "@/lib/auth";
import { ApiError, leads } from "@/services";
import { formatDate } from "@/lib/dates";
import { formatDateTime, humanize, isOverdue, lostReasonLabel, stageLabel, stageTone } from "@/lib/leads";
import { LeadForm } from "../LeadForm";
import { ActivityForm, AssignPanel, ConvertPanel, DeleteActivity, DeletePanel, StagePanel } from "./LeadPanels";

const card = "bg-white rounded-2xl border border-line p-6";

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requirePermission("leads:read");
  const canManage = can(session, "leads:manage");
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const lead = await leads.one(id).catch((e) => {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  });
  if (!lead) notFound();

  const [activities, sources, assignees, courses] = await Promise.all([
    leads.activities(id),
    leads.sources(),
    leads.assignees(),
    leads.courses(),
  ]);

  return (
    <div className="grid lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 space-y-6">
        <div className={card}>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-xl font-semibold text-green">{lead.name}</h2>
            <span className={`text-[11px] font-bold rounded-full px-2.5 py-1 ${stageTone(lead.stage)}`}>{stageLabel(lead.stage)}</span>
            <span className="ml-auto text-xs text-ink-soft">{lead.leadNo} · score {lead.score}</span>
          </div>
          <dl className="mt-4 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div><dt className="text-xs text-ink-soft">Phone</dt><dd>{lead.phone ?? "—"}{lead.alternatePhone ? ` / ${lead.alternatePhone}` : ""}</dd></div>
            <div><dt className="text-xs text-ink-soft">Email</dt><dd>{lead.email ? <a className="text-green-mid hover:underline" href={`mailto:${lead.email}`}>{lead.email}</a> : "—"}</dd></div>
            <div><dt className="text-xs text-ink-soft">Interested in</dt><dd>{lead.course?.name ?? "—"}</dd></div>
            <div><dt className="text-xs text-ink-soft">Source</dt><dd>{lead.source?.name ?? "—"}{lead.campaign ? ` · ${lead.campaign}` : ""}</dd></div>
            <div><dt className="text-xs text-ink-soft">Owner</dt><dd>{lead.assignedTo?.name ?? "Unassigned"}</dd></div>
            <div>
              <dt className="text-xs text-ink-soft">Next follow-up</dt>
              <dd className={isOverdue(lead.nextFollowUpAt, lead.stage) ? "text-red-600 font-bold" : ""}>{formatDateTime(lead.nextFollowUpAt)}</dd>
            </div>
            <div><dt className="text-xs text-ink-soft">Last contacted</dt><dd>{formatDateTime(lead.lastContactedAt)}</dd></div>
            <div><dt className="text-xs text-ink-soft">Created</dt><dd>{formatDate(lead.createdAt)}</dd></div>
          </dl>
          {lead.stage === "LOST" && (
            <p className="mt-4 text-sm bg-red-50 text-red-600 rounded-xl p-3">
              Lost: {lostReasonLabel(lead.lostReason)}{lead.lostNote ? ` - ${lead.lostNote}` : ""}
            </p>
          )}
          {lead.convertedApplicationId && (
            <p className="mt-4 text-sm bg-green-soft text-green rounded-xl p-3">
              Converted to{" "}
              <Link className="font-bold underline" href={`/admin/admissions/${lead.convertedApplicationId}`}>
                application #{lead.convertedApplicationId}
              </Link>{" "}
              ({humanize(lead.convertedApplication?.status ?? "")}).
            </p>
          )}
          {lead.remarks && <p className="mt-4 text-sm whitespace-pre-line">{lead.remarks}</p>}
        </div>

        {canManage && lead.stage !== "ENROLLED" && (
          <div className={card}>
            <h3 className="font-display text-base font-semibold text-green mb-4">Log an activity</h3>
            <ActivityForm lead={lead} />
          </div>
        )}

        <div className={card}>
          <h3 className="font-display text-base font-semibold text-green mb-4">Timeline</h3>
          {activities.length === 0 && <p className="text-sm text-ink-soft">Nothing yet.</p>}
          <ol className="space-y-4">
            {activities.map((a) => (
              <li key={a.id} className="border-l-2 border-line pl-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft">
                  <span className="font-extrabold uppercase bg-mist rounded-full px-2 py-0.5 text-[10px]">{humanize(a.type)}</span>
                  {a.outcome && <span>{humanize(a.outcome)}</span>}
                  <span>{formatDateTime(a.completedAt ?? a.scheduledAt ?? a.createdAt)}</span>
                  {a.scheduledAt && !a.completedAt && <span className="text-amber-ink font-bold">Planned</span>}
                  {a.performedBy && <span>· {a.performedBy.name}</span>}
                  {canManage && !a.isSystemGenerated && (
                    <span className="ml-auto"><DeleteActivity leadId={lead.id} activityId={a.id} /></span>
                  )}
                </div>
                <p className="text-sm font-bold text-ink mt-1">{a.subject}</p>
                {a.notes && <p className="text-sm text-ink-soft whitespace-pre-line">{a.notes}</p>}
              </li>
            ))}
          </ol>
        </div>

        {canManage && lead.stage !== "ENROLLED" && (
          <details className={card}>
            <summary className="cursor-pointer font-display text-base font-semibold text-green">Edit details</summary>
            <div className="mt-4">
              <LeadForm lead={lead} sources={sources.filter((s) => s.active || s.id === lead.sourceId)} courses={courses} />
            </div>
          </details>
        )}
      </div>

      {canManage && (
        <aside className="space-y-6">
          <div className={card}>
            <h3 className="font-display text-base font-semibold text-green mb-4">Stage</h3>
            <StagePanel lead={lead} />
          </div>
          <div className={card}>
            <h3 className="font-display text-base font-semibold text-green mb-4">Owner</h3>
            <AssignPanel lead={lead} assignees={assignees} />
          </div>
          {lead.stage !== "ENROLLED" && lead.stage !== "LOST" && (
            <div className={card}>
              <h3 className="font-display text-base font-semibold text-green mb-4">Convert</h3>
              <ConvertPanel lead={lead} courses={courses} />
            </div>
          )}
          {!lead.convertedApplicationId && (
            <div className={card}>
              <DeletePanel leadId={lead.id} />
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
