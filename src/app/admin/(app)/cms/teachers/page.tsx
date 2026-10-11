import Link from "next/link";
import { requirePermission } from "@/lib/auth";
import { admin } from "@/services";
import { TeacherProfileForm } from "./TeacherProfileForm";

/**
 * Teacher profiles — the photo and information the homepage teacher panel and the Teachers
 * page show. Accounts (login, role, password) stay under Users; this is content only.
 */
export default async function AdminTeacherProfilesPage() {
  await requirePermission("cms:manage");
  const teachers = await admin.teacherProfiles();

  return (
    <div className="max-w-4xl">
      <p className="mb-1 text-xs font-bold text-ink-soft">
        <Link href="/admin/cms" className="hover:text-green">CMS Pages</Link> / Teacher profiles
      </p>
      <h1 className="font-display text-2xl font-semibold text-green">Teacher profiles</h1>
      <p className="mb-6 mt-1 text-sm text-ink-soft">
        The photo, designation, subjects and qualifications shown for each teacher on the homepage and the Teachers page.
      </p>
      <div className="space-y-4">
        {teachers.map((tp) => (
          <TeacherProfileForm key={tp.id} teacher={tp} />
        ))}
        {teachers.length === 0 && (
          <p className="rounded-2xl border border-line bg-white p-6 text-sm text-ink-soft">
            No teachers yet — create teacher accounts under Users first.
          </p>
        )}
      </div>
    </div>
  );
}
