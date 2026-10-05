import { requirePermission } from "@/lib/auth";
import { LeadsTabs } from "./LeadsTabs";

/** CRM shell: one permission check and one tab bar for every page beneath /admin/leads. */
export default async function LeadsLayout({ children }: { children: React.ReactNode }) {
  await requirePermission("leads:read");
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-green mb-4">CRM</h1>
      <LeadsTabs />
      {children}
    </div>
  );
}
