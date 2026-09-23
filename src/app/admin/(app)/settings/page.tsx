import { requirePermission } from "@/lib/auth";
import { admin } from "@/services";
import { SettingsForm } from "./SettingsForm";

const GROUPS: Array<{ title: string; note?: string; keys: Array<[string, string]> }> = [
  {
    title: "Home page statistics (FR-HOME-04)",
    keys: [
      ["stat_total_students", "Total Students"],
      ["stat_total_classes", "Number of Classes"],
      ["stat_special_courses", "Special Courses"],
      ["stat_teachers_staff", "Teachers & Staff"],
    ],
  },
  {
    title: "School hours (home page office board)",
    note: "Printed under the school name above the office and classroom boards. Free text — leave a field blank and that half of the line is omitted rather than shown empty.",
    keys: [
      ["school_time_weekday", "Weekday hours (e.g. 5 PM – 9 PM)"],
      ["school_time_weekend", "Weekend hours (e.g. 9 AM – 3 PM, Saturday)"],
    ],
  },
  {
    title: "Contact & messaging",
    keys: [
      ["whatsapp_number", "WhatsApp number (click-to-chat)"],
      ["support_email", "Support email"],
      ["school_phone", "Phone 1"],
      ["school_phone2", "Phone 2"],
      ["contact_hours", "Contact hours (shown beside the footer phone numbers)"],
      ["facebook_url", "Facebook page URL"],
    ],
  },
  {
    title: "Bank transfer (FR-ADM-06)",
    keys: [
      ["bank_name", "Bank name"],
      ["bank_account_name", "Account holder"],
      ["bank_account_number", "Account number"],
    ],
  },
  {
    title: "Semester",
    keys: [
      ["semester_current", "Current semester (e.g. 2026-2)"],
      ["semester_1_dates", "Semester 1 dates"],
      ["semester_2_dates", "Semester 2 dates"],
    ],
  },
  {
    title: "Integrations (FR-ADMIN-13)",
    note: "SMTP, Zoom, and payment-gateway credentials are read from server environment variables (.env) for security — these fields record the account identifiers for reference.",
    keys: [
      ["zoom_account", "Zoom account email"],
      ["pg_provider", "Payment gateway provider"],
    ],
  },
];

/** FR-ADMIN-13: system settings. Super Admin only. */
export default async function SettingsPage() {
  await requirePermission("settings:manage");
  const all = await admin.settings();
  const values = Object.fromEntries(all.map((s) => [s.key, s.value]));

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-green mb-6">System Settings</h1>
      <SettingsForm groups={GROUPS} values={values} />
    </div>
  );
}
