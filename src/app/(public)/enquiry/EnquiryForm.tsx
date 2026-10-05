"use client";

import { useActionState } from "react";
import { Recaptcha } from "@/components/forms/Recaptcha";
import { keepForm } from "@/components/forms/keep-form";
import { submitEnquiry, type EnquiryState } from "./actions";

const input =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm focus:border-green-mid focus:outline-none";

export function EnquiryForm({
  recaptchaSiteKey,
  courses,
  sources,
}: {
  recaptchaSiteKey: string;
  courses: { id: number; name: string }[];
  sources: { id: number; name: string }[];
}) {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, null);

  if (state?.ok) {
    return (
      <div className="bg-white rounded-xl p-6 text-center">
        <h3 className="font-display text-lg font-semibold text-green">Thank you</h3>
        <p className="mt-1.5 text-sm text-ink-soft">
          Your enquiry has been received. Our office will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={keepForm(action)} className="space-y-4">
      <label className="block">
        <span className="text-xs font-bold text-ink">Your name *</span>
        <input name="name" required minLength={2} className={`mt-1.5 ${input}`} />
      </label>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-bold text-ink">Phone / WhatsApp</span>
          <input name="phone" className={`mt-1.5 ${input}`} />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-ink">Email</span>
          <input name="email" type="email" className={`mt-1.5 ${input}`} />
        </label>
      </div>
      <p className="text-xs text-ink-soft -mt-2">Give at least a phone number or an email so we can reach you.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-bold text-ink">Interested in</span>
          <select name="courseId" defaultValue="" className={`mt-1.5 ${input}`}>
            <option value="">Not sure yet</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-bold text-ink">City</span>
          <input name="city" className={`mt-1.5 ${input}`} />
        </label>
      </div>
      {sources.length > 0 && (
        <label className="block">
          <span className="text-xs font-bold text-ink">How did you hear about us?</span>
          <select name="sourceId" defaultValue="" className={`mt-1.5 ${input}`}>
            <option value="">—</option>
            {sources.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
      )}
      <label className="block">
        <span className="text-xs font-bold text-ink">Your question</span>
        <textarea name="message" rows={4} className={`mt-1.5 ${input}`} />
      </label>
      {state && !state.ok && <p role="alert" className="text-sm text-red-600 font-semibold">{state.error}</p>}
      <Recaptcha siteKey={recaptchaSiteKey} />
      <button
        type="submit"
        disabled={pending}
        className="bg-green hover:bg-green-deep disabled:opacity-60 text-white font-bold rounded-lg px-6 py-2.5 text-sm transition-colors"
      >
        {pending ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
