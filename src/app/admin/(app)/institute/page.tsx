import { requirePermission } from "@/lib/auth";
import { institute } from "@/services";
import { ActionForm, field, label } from "@/components/admin/ActionForm";
import { saveProfile, saveSettings } from "./actions";

/** LMS F1: the institute's profile and the settings that shape results and leave. */
export default async function InstitutePage() {
  await requirePermission("institute:manage");
  const inst = await institute.get();

  const input = (name: keyof typeof inst, title: string, opts: { type?: string; required?: boolean; wide?: boolean } = {}) => (
    <label className={`${label} ${opts.wide ? "sm:col-span-2" : ""}`}>
      {title}
      <input
        name={name}
        type={opts.type ?? "text"}
        required={opts.required}
        defaultValue={(inst[name] as string | null) ?? ""}
        className={`mt-1 w-full ${field}`}
      />
    </label>
  );

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-green">Institute Profile</h1>
        <p className="text-xs text-ink-soft mt-1">
          Code {inst.code}. The name, address and Head Master printed on tabulation sheets, mark sheets and certificates.
        </p>
      </div>

      <section className="bg-white rounded-2xl border border-line p-5">
        <h2 className="font-bold text-green text-sm mb-4">Profile</h2>
        <ActionForm action={saveProfile} submit="Save profile" className="grid sm:grid-cols-2 gap-4 items-end">
          {input("name", "Name (English)", { required: true, wide: true })}
          {input("nameBn", "Name (Bengali)")}
          {input("nameKo", "Name (Korean)")}
          {input("address", "Address", { wide: true })}
          {input("phone", "Phone")}
          {input("email", "Email", { type: "email" })}
          {input("website", "Website", { type: "url" })}
          {input("headMasterName", "Head Master's name (signs reports)")}
        </ActionForm>
      </section>

      <section className="bg-white rounded-2xl border border-line p-5">
        <h2 className="font-bold text-green text-sm mb-1">Results and leave</h2>
        <p className="text-xs text-ink-soft mb-4">Changing the tie rule affects results processed from now on, not ones already approved.</p>
        <ActionForm action={saveSettings} submit="Save settings" className="grid sm:grid-cols-2 gap-4 items-end">
          <label className={label}>
            Equal results
            <select name="rankTies" defaultValue={inst.rankTies} className={`mt-1 w-full ${field}`}>
              <option value="SHARED">Share the place, skip the next (1, 1, 3)</option>
              <option value="SPLIT">Break the tie by roll number (1, 2, 3)</option>
            </select>
          </label>
          <label className={label}>
            Leave a class teacher may approve alone (days)
            <input name="leaveTeacherMaxDays" type="number" min={0} max={30} defaultValue={inst.leaveTeacherMaxDays} className={`mt-1 w-full ${field}`} />
            <span className="block mt-1 font-normal text-ink-soft">0 sends every leave request to the Head Master.</span>
          </label>
        </ActionForm>
      </section>
    </div>
  );
}
