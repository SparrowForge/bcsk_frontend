"use client";

import { useActionState, useState } from "react";
import { useKeptForm } from "@/components/forms/keep-form";
import type { Coupon } from "@/services/types";
import { toLocalInput } from "@/lib/leads";
import { saveCoupon, type CouponState } from "./actions";

const input =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm focus:border-green-mid focus:outline-none";

/** A readable random code: no 0/O or 1/I to misread over the phone. */
function randomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const pick = () => chars[Math.floor(Math.random() * chars.length)];
  return `BCSK-${Array.from({ length: 6 }, pick).join("")}`;
}

const dateOnly = (iso: string | null) => (iso ? toLocalInput(iso).slice(0, 10) : "");

/** Create a coupon, or edit one (when `coupon` is given). */
export function CouponForm({ coupon }: { coupon?: Coupon }) {
  const [state, action, pending] = useActionState<CouponState, FormData>(saveCoupon, null);
  const kept = useKeptForm(action, state);
  const [type, setType] = useState<"PERCENT" | "FIXED">(coupon?.discountType ?? "PERCENT");
  const [code, setCode] = useState(coupon?.code ?? "");

  return (
    <form {...kept} className="space-y-4">
      {coupon && <input type="hidden" name="id" value={coupon.id} />}

      <fieldset>
        <legend className="text-xs font-bold text-ink mb-1.5">Discount type *</legend>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          {(
            [
              { value: "PERCENT", label: "Percent (%)", hint: "e.g. 10% off the total" },
              { value: "FIXED", label: "Fixed amount (₩)", hint: "e.g. ₩50,000 off the total" },
            ] as const
          ).map((o) => (
            <label
              key={o.value}
              className={`cursor-pointer rounded-xl border p-3 transition-colors ${
                type === o.value ? "border-green bg-green-soft" : "border-line bg-white hover:bg-mist"
              }`}
            >
              <input
                type="radio"
                name="discountType"
                value={o.value}
                checked={type === o.value}
                onChange={() => setType(o.value)}
                className="sr-only"
              />
              <span className="block text-sm font-bold text-green">{o.label}</span>
              <span className="block text-[11px] text-ink-soft mt-0.5">{o.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-bold text-ink">Coupon code *</span>
          <div className="mt-1.5 flex gap-2">
            <input
              name="code"
              required
              minLength={3}
              maxLength={30}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="SPRING25"
              className={`${input} font-mono uppercase`}
            />
            {!coupon && (
              <button
                type="button"
                onClick={() => setCode(randomCode())}
                className="shrink-0 rounded-lg border border-line px-3 text-xs font-bold text-green hover:bg-mist"
              >
                Generate
              </button>
            )}
          </div>
        </label>
        <label className="block">
          <span className="text-xs font-bold text-ink">
            {type === "PERCENT" ? "Percent off *" : "Amount off (₩) *"}
          </span>
          <div className="mt-1.5 relative">
            <input
              name="value"
              type="number"
              required
              min={1}
              max={type === "PERCENT" ? 99 : undefined}
              step={1}
              defaultValue={coupon?.value}
              placeholder={type === "PERCENT" ? "10" : "50000"}
              className={`${input} pr-10`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-soft" aria-hidden>
              {type === "PERCENT" ? "%" : "₩"}
            </span>
          </div>
          <span className="mt-1 block text-[11px] text-ink-soft">
            {type === "PERCENT"
              ? "1 to 99. Taken off the admission + fee total (books are not discounted)."
              : "Taken off the admission + fee total. At least ₩1,000 always stays payable."}
          </span>
        </label>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <label className="block">
          <span className="text-xs font-bold text-ink">Applies to</span>
          <select name="appliesTo" defaultValue={coupon?.appliesTo ?? "ALL"} className={`mt-1.5 ${input}`}>
            <option value="ALL">All registrations</option>
            <option value="REGULAR">Regular course only</option>
            <option value="SPECIAL">Special courses only</option>
            <option value="RE_ADMISSION">Re-admission only</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-bold text-ink">Valid from</span>
          <input name="validFrom" type="date" defaultValue={dateOnly(coupon?.validFrom ?? null)} className={`mt-1.5 ${input}`} />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-ink">Valid until (inclusive)</span>
          <input name="validUntil" type="date" defaultValue={dateOnly(coupon?.validUntil ?? null)} className={`mt-1.5 ${input}`} />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-bold text-ink">Usage limit</span>
          <input
            name="maxUses"
            type="number"
            min={1}
            defaultValue={coupon?.maxUses ?? ""}
            placeholder="Unlimited"
            className={`mt-1.5 ${input}`}
          />
          <span className="mt-1 block text-[11px] text-ink-soft">Counts applications that are not rejected.</span>
        </label>
        <label className="block">
          <span className="text-xs font-bold text-ink">Note (internal)</span>
          <input name="description" maxLength={200} defaultValue={coupon?.description ?? ""} className={`mt-1.5 ${input}`} />
        </label>
      </div>

      {coupon && (
        <label className="flex items-center gap-2 text-xs font-bold text-ink">
          <input type="checkbox" name="active" defaultChecked={coupon.active} className="w-4 h-4 accent-green" />
          Active (families can redeem it)
        </label>
      )}

      {state?.error && <p role="alert" className="text-sm font-semibold text-red-600">{state.error}</p>}
      {state?.ok && <p className="text-sm font-semibold text-green">Saved ✓</p>}
      <button
        disabled={pending}
        className="bg-green hover:bg-green-deep disabled:opacity-60 text-white font-bold rounded-lg px-6 py-2.5 text-sm transition-colors"
      >
        {pending ? "Saving…" : coupon ? "Save changes" : "Create coupon"}
      </button>
    </form>
  );
}
