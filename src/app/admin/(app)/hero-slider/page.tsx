import { requirePermission } from "@/lib/auth";
import { admin } from "@/services";
import { HeroSliderManager } from "./HeroSliderManager";

/** Homepage hero slider — admin-managed photos with an order and an active/inactive switch. */
export default async function AdminHeroSliderPage() {
  await requirePermission("slider:manage");
  const images = await admin.heroImages(); // already sorted by displayOrder, then id

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-2xl font-semibold text-green mb-2">Homepage Slider</h1>
      <p className="text-sm text-ink-soft mb-6">
        Photos shown one at a time in the homepage hero, auto-advancing every few seconds. Set each image&apos;s
        order and switch it on or off; only active images appear, lowest order first.
      </p>
      <HeroSliderManager
        images={images.map((i) => ({
          id: i.id,
          url: i.url,
          caption: i.caption,
          displayOrder: i.displayOrder,
          active: i.active,
        }))}
      />
    </div>
  );
}
