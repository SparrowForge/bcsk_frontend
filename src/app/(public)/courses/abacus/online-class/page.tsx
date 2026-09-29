import Link from "next/link";
import type { Metadata } from "next";
import { classroom, site } from "@/services";
import type { ClassVideo, ClassSession } from "@/services/types";
import { getSession } from "@/lib/auth";
import { formatDate } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Online Class",
  description: "Weekly live Abacus classes and class recordings for enrolled BCSK students.",
};

function videoHref(url: string) {
  return url.startsWith("http") ? url : `/api/files/${url}`;
}

/** "Abacus Level 0 – Class 1" → "Level 0, Class 1" */
function tileLabel(title: string) {
  return title.replace(/^Abacus\s+/, "").replace(/\s+[–-]\s+/, ", ");
}

function PlayThumb({ live }: { live?: boolean }) {
  return (
    <span className="relative aspect-video rounded-xl bg-abacus group-hover:bg-abacus-deep flex items-center justify-center transition-colors">
      <span className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow group-hover:scale-110 transition-transform">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="text-crimson ml-0.5">
          <path d="M7 4v16l13-8L7 4z" fill="currentColor" />
        </svg>
      </span>
      {live && (
        <span className="absolute top-2 left-2 bg-crimson text-white text-[10px] font-extrabold uppercase tracking-wide rounded px-1.5 py-0.5">
          Live now
        </span>
      )}
    </span>
  );
}

/** FR-ABC-05: the online class grid — recordings and live classes for enrolled students. */
export default async function AbacusOnlineClassPage() {
  const [course, slugs, session] = await Promise.all([
    site.course("abacus"),
    site.enrolledCourseSlugs(),
    getSession(),
  ]);
  const enrolled = slugs.includes("abacus");

  // Recordings are served only for the caller's own classes; a guest simply has none.
  let videos: ClassVideo[] = [];
  if (enrolled && session?.role === "STUDENT") {
    videos = await classroom.videos().catch(() => []);
  }
  const bySession = new Map<number, ClassVideo[]>();
  for (const v of videos) bySession.set(v.classSessionId, [...(bySession.get(v.classSessionId) ?? []), v]);
  for (const list of bySession.values()) list.sort((a, b) => b.recordedAt.localeCompare(a.recordedAt));

  // Group the sessions by level, in level order.
  const levels = course?.levels ?? [];
  const sessions = course?.sessions ?? [];
  const groups = [
    ...levels.map((l) => ({ key: String(l.id), name: l.name, sessions: sessions.filter((s) => s.courseLevelId === l.id) })),
    { key: "other", name: "Other classes", sessions: sessions.filter((s) => !s.courseLevelId) },
  ].filter((g) => g.sessions.length > 0);

  function tile(s: ClassSession) {
    const recordings = bySession.get(s.id) ?? [];
    const latest = recordings[0];
    const schedule = `${s.dayOfWeek} · ${s.startTime}${s.endTime ? `–${s.endTime}` : ""}`;
    const label = tileLabel(s.title);

    if (!enrolled) {
      return (
        <Link href="/classroom" className="group flex flex-col" aria-label={`${label} — log in to watch`}>
          <PlayThumb />
          <span className="mt-2 text-sm font-bold text-ink text-center">{label}</span>
          <span className="text-xs text-ink-soft text-center">{schedule}</span>
        </Link>
      );
    }

    const liveHref = s.isLive && s.zoomLink ? s.zoomLink : null;
    const href = liveHref ?? (latest ? videoHref(latest.videoUrl) : null);
    return (
      <div className="flex flex-col">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col"
            aria-label={liveHref ? `Join ${label} live` : `Watch ${label}: ${latest?.title}`}
          >
            <PlayThumb live={!!liveHref} />
          </a>
        ) : (
          <span className="flex flex-col opacity-70">
            <PlayThumb />
          </span>
        )}
        <span className="mt-2 text-sm font-bold text-ink text-center">{label}</span>
        <span className="text-xs text-ink-soft text-center">
          {latest ? `${latest.title} · ${formatDate(latest.recordedAt)}` : liveHref ? "Class in progress" : `Recording coming soon · ${schedule}`}
        </span>
        {recordings.length > 1 && (
          <details className="mt-1 text-xs text-center">
            <summary className="cursor-pointer font-bold text-green-mid">All recordings ({recordings.length})</summary>
            <ul className="mt-1 space-y-1">
              {recordings.map((v) => (
                <li key={v.id}>
                  <a href={videoHref(v.videoUrl)} target="_blank" rel="noopener noreferrer" className="text-green hover:underline">
                    {v.title} · {formatDate(v.recordedAt)}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        )}
        {!liveHref && s.zoomLink && (
          <a href={s.zoomLink} target="_blank" rel="noopener noreferrer" className="mt-1 text-xs font-bold text-green-mid text-center hover:underline">
            Zoom link for the live class
          </a>
        )}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 mt-12">
      <div className="text-center mb-8">
        <h2 className="inline-block bg-abacus text-ink font-display text-2xl sm:text-3xl font-semibold rounded-lg px-5 py-1.5">
          Online Class
        </h2>
        <p className="mt-3 text-sm text-ink-soft max-w-2xl mx-auto">
          {enrolled ? (
            "Watch your class recordings, or join the live class when it starts."
          ) : (
            <>
              Class recordings and live links are for enrolled students.{" "}
              <Link href="/classroom" className="font-bold text-green-mid hover:underline">Log in</Link> or{" "}
              <Link href="/apply/special?course=abacus" className="font-bold text-green-mid hover:underline">apply</Link> to join.
            </>
          )}
        </p>
      </div>

      {groups.length === 0 ? (
        <p className="text-center text-sm text-ink-soft">No classes are scheduled this semester yet.</p>
      ) : (
        <div className="space-y-10 max-w-5xl mx-auto">
          {groups.map((g) => (
            <div key={g.key}>
              <h3 className="font-display text-xl font-semibold text-green mb-4">{g.name}</h3>
              <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-6">
                {g.sessions.map((s) => (
                  <li key={s.id}>
                    {tile(s)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
