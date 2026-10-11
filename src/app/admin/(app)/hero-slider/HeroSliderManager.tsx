"use client";

import { useActionState, useTransition } from "react";
import { useKeptForm } from "@/components/forms/keep-form";
import { addHeroImage, updateHeroImage, deleteHeroImage, type HeroSliderState } from "./actions";

export type SliderImage = { id: number; url: string; caption: string | null; displayOrder: number; active: boolean };

const input = "rounded-lg border border-line px-3 py-2 text-sm focus:border-green-mid focus:outline-none";
/** Mirrors `AdminService.HERO_ACTIVE_LIMIT` / `HERO_IMAGE_LIMIT`; the server enforces both. */
const ACTIVE_LIMIT = 5;
const STORED_LIMIT = 20;

/**
 * The homepage slider's images: add one with its position and on/off state, then change
 * either later. The homepage shows the active ones only, lowest order first.
 */
export function HeroSliderManager({ images }: { images: SliderImage[] }) {
  const activeCount = images.filter((i) => i.active).length;
  const nextOrder = images.reduce((m, i) => Math.max(m, i.displayOrder), 0) + 1;

  return (
    <div className="space-y-6">
      <AddImageForm
        full={images.length >= STORED_LIMIT}
        activeFull={activeCount >= ACTIVE_LIMIT}
        nextOrder={nextOrder}
      />

      <div className="rounded-2xl border border-line bg-white">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-line px-5 py-4">
          <h2 className="font-bold text-green">Slider images</h2>
          <span className="text-xs text-ink-soft">
            <strong className="text-green">{activeCount}</strong> of {ACTIVE_LIMIT} active · {images.length} of {STORED_LIMIT} stored
          </span>
          <span className="w-full text-xs text-ink-soft">
            The homepage shows <strong>active</strong> images only, in order — lowest number first.
          </span>
        </div>
        {images.length === 0 ? (
          <p className="px-5 py-8 text-sm text-ink-soft">
            No images yet — the homepage shows its default illustration and photos until you add one.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {images.map((img, i) => (
              <ImageRow key={img.id} image={img} position={i + 1} activeFull={activeCount >= ACTIVE_LIMIT} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function AddImageForm({ full, activeFull, nextOrder }: { full: boolean; activeFull: boolean; nextOrder: number }) {
  const [state, action, pending] = useActionState<HeroSliderState, FormData>(addHeroImage, null);
  const kept = useKeptForm(action, state, { resetOnSuccess: true });

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <h2 className="mb-4 font-bold text-green">Add an image</h2>
      {full ? (
        <p className="text-xs font-semibold text-ink-soft">
          The slider stores at most {STORED_LIMIT} images. Remove one below before adding another.
        </p>
      ) : (
        <form {...kept} className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <label className="block text-xs font-bold text-ink sm:col-span-3">
            Image <span className="font-normal text-ink-soft">(JPG, PNG or WEBP — a wide photo, around 16:9, fits best)</span>
            <input
              type="file"
              name="image"
              required
              accept="image/jpeg,image/png,image/webp"
              className={`mt-1.5 w-full ${input} file:mr-3 file:rounded file:border-0 file:bg-green-soft file:px-3 file:py-1 file:text-xs file:font-bold file:text-green`}
            />
          </label>
          <label className="block text-xs font-bold text-ink">
            Caption <span className="font-normal text-ink-soft">(describes the photo for screen readers)</span>
            <input name="caption" maxLength={200} className={`mt-1.5 w-full ${input}`} />
          </label>
          <label className="block text-xs font-bold text-ink">
            Order
            <input name="displayOrder" type="number" min={0} max={9999} placeholder={String(nextOrder)} className={`mt-1.5 w-24 ${input}`} />
          </label>
          <label className="flex items-center gap-2 pb-2 text-xs font-bold text-ink">
            {/* Starts unticked when the active slots are full, so the upload still succeeds
                as an inactive image instead of failing on the limit. */}
            <input type="checkbox" name="active" defaultChecked={!activeFull} /> Active
          </label>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-3">
            <button
              disabled={pending}
              className="rounded-lg bg-crimson px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-crimson-deep disabled:opacity-60"
            >
              {pending ? "Uploading…" : "Add to slider"}
            </button>
            <span className="text-[11px] text-ink-soft">Leave Order blank to put the image last.</span>
            {activeFull && (
              <span className="text-[11px] font-semibold text-amber-ink">
                {ACTIVE_LIMIT} images are already active — this one will be added as inactive.
              </span>
            )}
          </div>
          {state?.error && <p className="text-xs font-semibold text-crimson-ink sm:col-span-3">{state.error}</p>}
          {state?.ok && <p className="text-xs font-semibold text-green sm:col-span-3">Added.</p>}
        </form>
      )}
    </div>
  );
}

function ImageRow({ image, position, activeFull }: { image: SliderImage; position: number; activeFull: boolean }) {
  const [state, action, pending] = useActionState<HeroSliderState, FormData>(updateHeroImage, null);
  // Kept, not reset: a refused save (the active limit) must not wipe what was typed.
  const kept = useKeptForm(action, state);
  const [removing, startRemove] = useTransition();

  return (
    <li className="flex flex-wrap items-start gap-4 px-5 py-4">
      <div className="relative w-40 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={image.caption ?? ""}
          className={`aspect-video w-full rounded-lg border border-line object-cover ${image.active ? "" : "opacity-45 grayscale"}`}
        />
        <span
          className={`absolute left-1.5 top-1.5 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
            image.active ? "bg-green text-white" : "bg-mist-deep text-ink-soft"
          }`}
        >
          {image.active ? "Active" : "Inactive"}
        </span>
        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 px-1.5 text-[10px] font-bold text-white">#{position}</span>
      </div>

      <form {...kept} className="grid min-w-0 flex-1 gap-3 sm:grid-cols-[auto_1fr]">
        <input type="hidden" name="id" value={image.id} />
        <label className="block text-xs font-bold text-ink">
          Order
          <input name="displayOrder" type="number" min={0} max={9999} required defaultValue={image.displayOrder} className={`mt-1.5 w-24 ${input}`} />
        </label>
        <label className="block text-xs font-bold text-ink">
          Caption
          <input name="caption" maxLength={200} defaultValue={image.caption ?? ""} className={`mt-1.5 w-full ${input}`} />
        </label>
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <label className="flex items-center gap-2 text-xs font-bold text-ink">
            <input type="checkbox" name="active" defaultChecked={image.active} /> Active
          </label>
          <button
            disabled={pending}
            className="rounded-lg bg-green px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-green-deep disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            disabled={removing}
            onClick={() => {
              if (window.confirm("Remove this image from the slider? This cannot be undone.")) {
                startRemove(() => deleteHeroImage(image.id));
              }
            }}
            className="text-xs font-bold text-crimson-ink hover:underline disabled:opacity-60"
          >
            {removing ? "Removing…" : "Remove"}
          </button>
          {!image.active && activeFull && (
            <span className="text-[11px] text-ink-soft">{ACTIVE_LIMIT} are active — switch one off to activate this.</span>
          )}
          {state?.error && <span className="text-xs font-semibold text-crimson-ink">{state.error}</span>}
          {state?.ok && <span className="text-xs font-semibold text-green">Saved.</span>}
        </div>
      </form>
    </li>
  );
}
