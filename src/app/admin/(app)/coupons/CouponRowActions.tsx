"use client";

import { useTransition } from "react";
import { deleteCoupon, setCouponActive } from "./actions";

export function CouponRowActions({ id, active, used }: { id: number; active: boolean; used: number }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex items-center gap-4 text-xs font-bold">
      <button
        disabled={pending}
        onClick={() => start(() => setCouponActive(id, !active))}
        className="text-green-mid hover:underline disabled:opacity-60"
      >
        {active ? "Deactivate" : "Activate"}
      </button>
      <button
        disabled={pending}
        onClick={() => {
          const msg =
            used > 0
              ? "This coupon has been redeemed, so it will be deactivated and kept on those applications. Continue?"
              : "Delete this coupon?";
          if (confirm(msg)) start(() => deleteCoupon(id));
        }}
        className="text-red-600 hover:underline disabled:opacity-60"
      >
        {used > 0 ? "Retire" : "Delete"}
      </button>
    </div>
  );
}
