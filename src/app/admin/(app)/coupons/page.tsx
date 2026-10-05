import { requirePermission } from "@/lib/auth";
import { coupons } from "@/services";
import { krw } from "@/lib/format";
import { formatDateTime } from "@/lib/leads";
import type { Coupon } from "@/services/types";
import { CouponForm } from "./CouponForm";
import { CouponRowActions } from "./CouponRowActions";

const APPLIES: Record<Coupon["appliesTo"], string> = {
  ALL: "All registrations",
  REGULAR: "Regular course",
  SPECIAL: "Special courses",
  RE_ADMISSION: "Re-admission",
};

/** Redeemable right now: switched on, inside its dates, and not used up. */
function state(c: Coupon, now = Date.now()): { label: string; tone: string } {
  if (!c.active) return { label: "Inactive", tone: "bg-mist text-ink-soft" };
  if (c.validFrom && new Date(c.validFrom).getTime() > now) return { label: "Scheduled", tone: "bg-amber/15 text-amber-ink" };
  if (c.validUntil && new Date(c.validUntil).getTime() < now) return { label: "Expired", tone: "bg-red-50 text-red-600" };
  if (c.maxUses !== null && c.used >= c.maxUses) return { label: "Used up", tone: "bg-red-50 text-red-600" };
  return { label: "Active", tone: "bg-green/15 text-green" };
}

const day = (iso: string | null) => (iso ? formatDateTime(iso).split(",")[0] : null);

/** Discount coupons for the admission form: percent off or a fixed amount off the fee total. */
export default async function CouponsPage() {
  await requirePermission("coupons:manage");
  const list = await coupons.list();

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="font-display text-2xl font-semibold text-green">Discount Coupons</h1>

      <div className="bg-white rounded-2xl border border-line p-6">
        <h2 className="font-display text-lg font-semibold text-green mb-4">New coupon</h2>
        {/* Remounts after each new coupon (the list grows), which clears the controlled fields. */}
        <CouponForm key={list.length} />
      </div>

      <div className="space-y-4">
        {list.length === 0 && <p className="bg-white rounded-2xl border border-line p-6 text-sm text-ink-soft">No coupons yet.</p>}
        {list.map((c) => {
          const s = state(c);
          return (
            <div key={c.id} className="bg-white rounded-2xl border border-line p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono font-bold text-ink text-base">{c.code}</span>
                <span className={`text-[11px] font-bold rounded-full px-2.5 py-1 ${s.tone}`}>{s.label}</span>
                <span className="font-bold text-green">
                  {c.discountType === "PERCENT" ? `${c.value}% off` : `${krw(c.value)} off`}
                </span>
                <span className="ml-auto text-xs text-ink-soft">
                  {c.used}
                  {c.maxUses !== null ? ` / ${c.maxUses}` : ""} used
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-soft">
                {APPLIES[c.appliesTo]}
                {(c.validFrom || c.validUntil) && ` · ${day(c.validFrom) ?? "any time"} → ${day(c.validUntil) ?? "no end"}`}
                {c.description && ` · ${c.description}`}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <CouponRowActions id={c.id} active={c.active} used={c.used} />
              </div>
              <details className="mt-3 border-t border-line pt-3">
                <summary className="cursor-pointer text-xs font-bold text-green-mid">Edit</summary>
                <div className="mt-4">
                  <CouponForm coupon={c} />
                </div>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
}
