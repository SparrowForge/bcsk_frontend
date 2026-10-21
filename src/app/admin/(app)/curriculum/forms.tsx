"use client";

import { useActionState, useTransition, useState } from "react";
import { useKeptForm } from "@/components/forms/keep-form";
import { CLASS_COLOR_OPTIONS, SUBJECT_COLOR_OPTIONS, SUBJECT_CATEGORIES, paletteFor } from "@/lib/academic-palette";
import type { AcademicClass, ClassSubject } from "@/services/types";
import { saveClass, saveSubject, deleteClass, deleteSubject, type CurriculumState } from "./actions";

const input =
  "mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm focus:border-green-mid focus:outline-none";
const label = "block text-xs font-bold text-ink";

function Status({ state, pending, saved = "Saved." }: { state: CurriculumState; pending: boolean; saved?: string }) {
  if (pending) return null;
  if (state?.error) return <p role="alert" className="text-xs font-semibold text-red-600">{state.error}</p>;
  if (state?.ok) return <p className="text-xs font-semibold text-green">{saved}</p>;
  return null;
}

/** A colour picker as swatches, so the office chooses by eye rather than by name. */
function Swatches({ name, options, value }: { name: string; options: readonly string[]; value: string }) {
  const [picked, setPicked] = useState(value);
  return (
    <fieldset>
      <legend className={label}>Colour</legend>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} title={o} className="cursor-pointer">
            <input type="radio" name={name} value={o} checked={picked === o} onChange={() => setPicked(o)} className="peer sr-only" />
            <span
              className="block h-8 w-8 rounded-full ring-offset-2 peer-checked:ring-2 peer-checked:ring-ink peer-focus-visible:ring-2 peer-focus-visible:ring-green-mid"
              style={{ background: paletteFor(o).base }}
            />
            <span className="sr-only">{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function ImageInput({ name, field, current, hint }: { name: string; field: string; current: string | null; hint: string }) {
  return (
    <div>
      <span className={label}>{hint}</span>
      <div className="mt-1.5 flex items-center gap-3">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current} alt="" className="h-14 w-14 rounded-lg border border-line object-cover" />
        ) : (
          <span className="grid h-14 w-14 place-items-center rounded-lg bg-mist text-[10px] text-ink-soft">None</span>
        )}
        <input type="file" name={field} accept="image/jpeg,image/png,image/webp" className="text-xs" />
        <input type="hidden" name={name} value={current ?? ""} />
      </div>
    </div>
  );
}

/** Create a class, or edit one when `c` is given. */
export function ClassForm({ c }: { c?: AcademicClass }) {
  const [state, action, pending] = useActionState<CurriculumState, FormData>(saveClass, null);
  const kept = useKeptForm(action, state);
  return (
    <form {...kept} className="space-y-4 rounded-2xl border border-line bg-white p-6">
      {c && <input type="hidden" name="id" value={c.id} />}
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className={label}>Name *</span>
          <input name="name" required defaultValue={c?.name} placeholder="Class 1" className={input} />
        </label>
        <label className="block">
          <span className={label}>Page address *</span>
          <input name="slug" required defaultValue={c?.slug} placeholder="class-1" pattern="[a-z0-9]+(-[a-z0-9]+)*" className={input} />
        </label>
        <label className="block">
          <span className={label}>Age range</span>
          <input name="ageRange" defaultValue={c?.ageRange ?? ""} placeholder="Age 6-7" className={input} />
        </label>
      </div>
      <label className="block">
        <span className={label}>Card text (shown on the class list)</span>
        <textarea name="summary" rows={2} maxLength={400} defaultValue={c?.summary ?? ""} className={input} />
      </label>
      <label className="block">
        <span className={label}>Banner line (under the title on the class page)</span>
        <input name="tagline" maxLength={160} defaultValue={c?.tagline ?? ""} className={input} />
      </label>
      <label className="block">
        <span className={label}>&ldquo;What we offer&rdquo; paragraph</span>
        <textarea name="intro" rows={4} maxLength={1200} defaultValue={c?.intro ?? ""} className={input} />
      </label>
      <label className="block">
        <span className={label}>&ldquo;What we offer&rdquo; items (one per line, up to 8)</span>
        <textarea name="highlights" rows={4} defaultValue={c?.highlights.join("\n") ?? ""} className={input} />
      </label>
      <Swatches name="color" options={CLASS_COLOR_OPTIONS} value={c?.color ?? "green"} />
      <div className="grid gap-4 sm:grid-cols-2">
        <ImageInput name="cardImageUrl" field="cardImage" current={c?.cardImageUrl ?? null} hint="Card photo" />
        <ImageInput name="bannerImageUrl" field="bannerImage" current={c?.bannerImageUrl ?? null} hint="Banner photo" />
      </div>
      <div className="flex flex-wrap items-end gap-6">
        <label className="block w-32">
          <span className={label}>Order</span>
          <input name="displayOrder" type="number" min={0} max={9999} defaultValue={c?.displayOrder ?? 100} className={input} />
        </label>
        <label className="flex items-center gap-2 pb-2.5 text-sm text-ink">
          <input type="checkbox" name="active" defaultChecked={c?.active ?? true} />
          Shown on the website
        </label>
      </div>
      <div className="flex items-center gap-3">
        <button disabled={pending} className="rounded-lg bg-green px-5 py-2.5 text-sm font-bold text-white hover:bg-green/85 disabled:opacity-60">
          {pending ? "Saving…" : c ? "Save class" : "Add class"}
        </button>
        <Status state={state} pending={pending} />
      </div>
    </form>
  );
}

/** Add a book to a class, or edit one when `s` is given. */
export function SubjectForm({ classId, s }: { classId: number; s?: ClassSubject }) {
  const [state, action, pending] = useActionState<CurriculumState, FormData>(saveSubject.bind(null, classId), null);
  const kept = useKeptForm(action, state, { resetOnSuccess: !s });
  return (
    <form {...kept} className="space-y-4">
      {s && <input type="hidden" name="id" value={s.id} />}
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr_8rem]">
        <label className="block">
          <span className={label}>Title *</span>
          <input name="title" required defaultValue={s?.title} placeholder="Bangla Main Book" className={input} />
        </label>
        <label className="block">
          <span className={label}>Section</span>
          <select name="category" defaultValue={s?.category ?? "MAIN"} className={input}>
            {SUBJECT_CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={label}>Order</span>
          <input name="displayOrder" type="number" min={0} max={9999} defaultValue={s?.displayOrder ?? 100} className={input} />
        </label>
      </div>
      <label className="block">
        <span className={label}>Description</span>
        <textarea name="description" rows={3} maxLength={1200} defaultValue={s?.description ?? ""} className={input} />
      </label>
      <label className="block">
        <span className={label}>Learning outcomes (one per line)</span>
        <textarea name="outcomes" rows={4} defaultValue={s?.outcomes.join("\n") ?? ""} className={input} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <Swatches name="color" options={SUBJECT_COLOR_OPTIONS} value={s?.color ?? "pink"} />
        <ImageInput name="coverImageUrl" field="coverImage" current={s?.coverImageUrl ?? null} hint="Book cover" />
      </div>
      <div className="flex items-center gap-3">
        <button disabled={pending} className="rounded-lg bg-green px-5 py-2.5 text-sm font-bold text-white hover:bg-green/85 disabled:opacity-60">
          {pending ? "Saving…" : s ? "Save book" : "Add book"}
        </button>
        <Status state={state} pending={pending} saved={s ? "Saved." : "Added."} />
      </div>
    </form>
  );
}

export function DeleteButton({ kind, id, classId, name }: { kind: "class" | "subject"; id: number; classId: number; name: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const warning =
    kind === "class" ? `Delete ${name} and all its books from the website?` : `Delete "${name}" from this class?`;
  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!window.confirm(warning)) return;
          start(async () => {
            const r = kind === "class" ? await deleteClass(id) : await deleteSubject(id, classId);
            setError(r?.error ?? null);
          });
        }}
        className="rounded-lg border-2 border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
      >
        {pending ? "Deleting…" : kind === "class" ? "Delete class" : "Delete"}
      </button>
      {error && <span role="alert" className="text-xs font-semibold text-red-600">{error}</span>}
    </span>
  );
}
