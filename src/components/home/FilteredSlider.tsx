"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { CardSlider } from "./CardSlider";

/**
 * A `CardSlider` with a row of filter chips above it — "All" and one chip per group present.
 *
 * The chips only appear when there is more than one group to choose between; a band holding
 * one kind of thing does not need a control that does nothing. Changing the filter remounts
 * the strip (`key`), so it starts again from the first card instead of keeping a scroll
 * offset measured against a different list.
 */
export function FilteredSlider({
  items,
  groups,
  allLabel,
  label,
  basis,
  footer,
  t,
}: {
  items: { key: string; group: string; node: React.ReactNode }[];
  /** Every group present, in display order, with its label and its active chip colour. */
  groups: { key: string; label: string; active: string }[];
  allLabel: string;
  label: string;
  basis: string;
  footer?: React.ReactNode;
  t: Dictionary;
}) {
  const [filter, setFilter] = useState<string | null>(null);
  const visible = filter ? items.filter((i) => i.group === filter) : items;
  const chips = [{ key: null, label: allLabel, active: "bg-green text-white" }, ...groups];

  return (
    <>
      {groups.length > 1 && (
        <div className="mt-5 flex flex-wrap justify-center gap-2" role="group" aria-label={label}>
          {chips.map((c) => {
            const on = filter === c.key;
            return (
              <button
                key={c.key ?? "all"}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(c.key)}
                className={`press rounded-full px-4 py-1.5 text-[12.5px] font-bold transition-colors ${
                  on ? c.active : "bg-white text-green ring-1 ring-green/15 hover:ring-green/40"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      )}
      <CardSlider key={filter ?? "all"} t={t} label={label} basis={basis} items={visible} footer={footer} />
    </>
  );
}
