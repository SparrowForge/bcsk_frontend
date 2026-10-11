"use client";

import { useActionState } from "react";
import type { TeacherProfileRow } from "@/services/types";
import { saveTeacherProfile, type TeacherProfileState } from "./actions";

const input = "w-full rounded-lg border border-line px-3.5 py-2.5 text-sm focus:border-green-mid focus:outline-none";

/** One teacher's public profile, editable in place. */
export function TeacherProfileForm({ teacher }: { teacher: TeacherProfileRow }) {
  const [state, action, pending] = useActionState<TeacherProfileState, FormData>(saveTeacherProfile, null);

  return (
    <form action={action} className="rounded-2xl border border-line bg-white p-5 sm:p-6">
      <input type="hidden" name="id" value={teacher.id} />
      <div className="flex flex-wrap items-start gap-5">
        <div className="flex flex-col items-center gap-2">
          {teacher.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={teacher.photoUrl} alt={teacher.name} className="h-24 w-24 rounded-full object-cover ring-4 ring-green-soft" />
          ) : (
            <div className="grid h-24 w-24 place-items-center rounded-full bg-green-soft font-display text-2xl font-semibold text-green">
              {teacher.name.split(" ").slice(-2).map((w) => w[0]).join("")}
            </div>
          )}
          {teacher.photoUrl && (
            <label className="flex items-center gap-1.5 text-[11px] font-bold text-crimson-ink">
              <input type="checkbox" name="removePhoto" /> Remove photo
            </label>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <p className="font-bold text-ink">{teacher.name}</p>
            <p className="font-mono text-[11px] text-ink-soft">{teacher.teacherId}</p>
          </div>
          <label className="block text-xs font-bold text-ink">
            {teacher.photoUrl ? "Replace photo" : "Photo"} <span className="font-normal text-ink-soft">(JPG, PNG or WEBP — a square face photo works best)</span>
            <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" className={`mt-1.5 ${input} file:mr-3 file:rounded file:border-0 file:bg-green-soft file:px-3 file:py-1 file:text-xs file:font-bold file:text-green`} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-bold text-ink">
              Designation
              <input name="designation" defaultValue={teacher.designation ?? ""} placeholder="English Teacher" className={`mt-1.5 ${input}`} />
            </label>
            <label className="block text-xs font-bold text-ink">
              Subjects
              <input name="subjects" defaultValue={teacher.subjects ?? ""} placeholder="English, IELTS for Kids" className={`mt-1.5 ${input}`} />
            </label>
          </div>
          <label className="block text-xs font-bold text-ink">
            Qualifications &amp; background <span className="font-normal text-ink-soft">(shown on the homepage teacher card)</span>
            <textarea name="bio" rows={3} maxLength={1500} defaultValue={teacher.bio ?? ""} className={`mt-1.5 ${input}`} />
          </label>
          <div className="flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-2 text-xs font-bold text-ink">
              <input type="checkbox" name="isPublic" defaultChecked={teacher.isPublic} /> Show on the public site
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-ink">
              Order
              <input name="displayOrder" type="number" min={0} defaultValue={teacher.displayOrder} className="w-20 rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            </label>
            <button
              disabled={pending}
              className="ml-auto rounded-lg bg-green px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-green-deep disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save profile"}
            </button>
          </div>
          {state?.error && <p className="text-xs font-bold text-crimson-ink">{state.error}</p>}
          {state?.ok && <p className="text-xs font-bold text-green">Saved.</p>}
        </div>
      </div>
    </form>
  );
}
