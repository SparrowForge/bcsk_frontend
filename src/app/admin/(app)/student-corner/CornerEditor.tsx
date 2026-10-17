"use client";

import { useActionState, useState, useTransition } from "react";
import { useKeptForm } from "@/components/forms/keep-form";
import { PictureField } from "@/components/forms/PictureField";
import { SUGGESTED_KINDS, kindTitle } from "@/lib/corner-kinds";
import { saveCornerPost, deleteCornerPost, type CornerState } from "./actions";

type Post = { id: number; title: string; body: string; studentName: string; kind: string; published: boolean; imageUrl: string | null };
const input = "w-full rounded-lg border border-line px-3.5 py-2.5 text-sm focus:border-green-mid focus:outline-none";

export function CornerEditor({ posts }: { posts: Post[] }) {
  // Suggest every kind already in use as well as the standard ones, so a kind typed once is
  // offered again with the same spelling.
  const kinds = [...new Set([...SUGGESTED_KINDS, ...posts.map((p) => kindTitle(p.kind))])];
  const [editing, setEditing] = useState<Post | "new" | null>(null);
  const [state, action, pending] = useActionState<CornerState, FormData>(saveCornerPost, null);
  const kept = useKeptForm(action, state, { resetOnSuccess: true });
  const [, startDelete] = useTransition();
  const current = editing === "new" ? null : editing;

  return (
    <div>
      <button
        onClick={() => setEditing(editing === "new" ? null : "new")}
        className="mb-5 bg-crimson hover:bg-crimson-deep text-white text-xs font-bold rounded-lg px-4 py-2.5 transition-colors"
      >
        {editing === "new" ? "Close" : "+ New post"}
      </button>

      {editing !== null && (
        <form key={current?.id ?? "new"} {...kept} className="bg-white rounded-2xl border border-line p-6 space-y-4 mb-6">
          <input type="hidden" name="id" value={current?.id ?? 0} />
          <div className="grid sm:grid-cols-3 gap-4">
            <label className="block text-xs font-bold text-ink">
              Kind
              <input
                name="kind"
                required
                list="corner-kinds"
                maxLength={40}
                defaultValue={current ? kindTitle(current.kind) : "Article"}
                placeholder="e.g. Handicraft"
                className={`mt-1.5 ${input}`}
              />
              <datalist id="corner-kinds">
                {kinds.map((k) => (
                  <option key={k} value={k} />
                ))}
              </datalist>
              <span className="mt-1 block text-[11px] font-normal text-ink-soft">Pick one or type a new kind.</span>
            </label>
            <label className="block text-xs font-bold text-ink sm:col-span-2">
              Student name & class
              <input name="studentName" required defaultValue={current?.studentName ?? ""} placeholder="e.g. Arif Rahman, Class 2" className={`mt-1.5 ${input}`} />
            </label>
          </div>
          <label className="block text-xs font-bold text-ink">
            Title
            <input name="title" required defaultValue={current?.title ?? ""} className={`mt-1.5 ${input}`} />
          </label>
          <label className="block text-xs font-bold text-ink">
            Body
            <textarea name="body" required rows={6} defaultValue={current?.body ?? ""} className={`mt-1.5 ${input}`} />
          </label>
          <PictureField current={current?.imageUrl ?? null} optional />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-bold text-ink">
              <input type="checkbox" name="published" defaultChecked={current?.published ?? true} className="w-4 h-4 accent-green" />
              Published
            </label>
            <button disabled={pending} className="ml-auto bg-green hover:bg-green-deep disabled:opacity-60 text-white text-sm font-bold rounded-lg px-6 py-2.5 transition-colors">
              {pending ? "Saving…" : "Save"}
            </button>
          </div>
          {state?.ok && <p className="text-sm font-bold text-green">Saved ✓</p>}
          {state?.error && <p className="text-sm font-semibold text-red-600">{state.error}</p>}
        </form>
      )}

      <div className="bg-white rounded-2xl border border-line divide-y divide-line">
        {posts.map((p) => (
          <div key={p.id} className="px-5 py-3.5 flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-extrabold uppercase text-crimson-ink w-24 truncate" title={kindTitle(p.kind)}>{kindTitle(p.kind)}</span>
            <div className="min-w-48 flex-1">
              <p className="font-bold text-ink text-sm">{p.title}</p>
              <p className="text-[11px] text-ink-soft">{p.studentName}{!p.published && " · draft"}</p>
            </div>
            <button onClick={() => setEditing(p)} className="text-xs font-bold text-green-mid hover:underline">Edit</button>
            <button
              onClick={() => { if (confirm(`Delete "${p.title}"?`)) startDelete(() => deleteCornerPost(p.id)); }}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
