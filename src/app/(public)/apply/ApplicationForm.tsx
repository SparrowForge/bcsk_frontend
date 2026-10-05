"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Recaptcha } from "@/components/forms/Recaptcha";
import { Field, SelectField, PhotoField, ConsentField, inputCls } from "@/components/forms/fields";
import { keepForm } from "@/components/forms/keep-form";
import { krw } from "@/lib/format";
import { submitApplication, previewFee, type ApplyState, type FeePreviewState, type RegistrationType } from "./actions";

export type ClassChoice = { id: number; name: string };
export type CourseChoice = { value: string; label: string; levels: { id: number; name: string }[] };

const TYPES: { value: RegistrationType; label: string; hint: string }[] = [
  { value: "REGULAR", label: "Regular course", hint: "New student, Pre-Primary to Class 5" },
  { value: "SPECIAL", label: "Special course", hint: "IELTS, Abacus, Qur'an & Deen, Hifz…" },
  { value: "RE_ADMISSION", label: "Re-admission", hint: "Current BCSK student, next semester" },
];

const section = "font-display text-lg font-semibold text-green pt-2";

/**
 * The single registration form (FR-ADM-02/03/10). The applicant fields are the same for every
 * registration type and are saved to the one ApplicationForm table; the type only changes the
 * "what are you registering for" block and which guardian fields are asked.
 */
export function ApplicationForm({
  initialType,
  classes,
  courses,
  preselectCourse,
  recaptchaSiteKey,
}: {
  initialType: RegistrationType;
  /** The Regular Course's levels - Pre-Primary, Class 1-5 - for regular and re-admission. */
  classes: ClassChoice[];
  courses: CourseChoice[];
  preselectCourse?: string;
  recaptchaSiteKey: string;
}) {
  const [state, action, pending] = useActionState<ApplyState, FormData>(submitApplication, null);
  const [type, setType] = useState<RegistrationType>(initialType);
  const [classId, setClassId] = useState("");
  const [levelId, setLevelId] = useState("");
  const [course, setCourse] = useState(courses.some((c) => c.value === preselectCourse) ? preselectCourse! : "");
  const [bcsk, setBcsk] = useState(false);
  const [fee, setFee] = useState<FeePreviewState | null>(null);
  const [loadingFee, setLoadingFee] = useState(false);
  const latest = useRef(0);

  const isSpecial = type === "SPECIAL";
  const isRegular = type === "REGULAR";
  const levels = courses.find((c) => c.value === course)?.levels ?? [];

  /** Ask the server for the fee table. Only the newest request may update the panel. */
  async function refreshFee(nextType: RegistrationType, pick: { course?: string; level?: string; cls?: string }) {
    const ticket = ++latest.current;
    const special = nextType === "SPECIAL";
    if (!(special ? pick.course : pick.cls)) {
      setFee(null);
      setLoadingFee(false);
      return;
    }
    setLoadingFee(true);
    const result = await previewFee(
      nextType,
      special
        ? { courseName: pick.course, courseLevelId: Number(pick.level) || undefined }
        : { courseLevelId: Number(pick.cls) },
    );
    if (ticket !== latest.current) return;
    setFee(result);
    setLoadingFee(false);
  }

  function chooseType(next: RegistrationType) {
    setType(next);
    void refreshFee(next, { course, level: levelId, cls: classId });
  }

  // A course arriving from a course page (?course=abacus) should show its fees straight away,
  // unless the family has already picked something else by the time the answer lands.
  useEffect(() => {
    if (initialType !== "SPECIAL" || !course) return;
    let live = true;
    void previewFee("SPECIAL", { courseName: course }).then((r) => {
      if (live && latest.current === 0) setFee(r);
    });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, for the course the page arrived with
  }, []);

  return (
    <form onSubmit={keepForm(action)} className="space-y-5">
      <input type="hidden" name="type" value={type} />

      <fieldset>
        <legend className="text-xs font-bold text-ink mb-1.5">I am registering for</legend>
        <div className="grid sm:grid-cols-3 gap-3">
          {TYPES.map((t) => (
            <button
              type="button"
              key={t.value}
              onClick={() => chooseType(t.value)}
              aria-pressed={type === t.value}
              className={`text-left rounded-xl border p-3.5 transition-colors ${
                type === t.value ? "border-green bg-green-soft" : "border-line bg-white hover:bg-mist"
              }`}
            >
              <span className="block text-sm font-bold text-green">{t.label}</span>
              <span className="block mt-0.5 text-[11px] text-ink-soft leading-snug">{t.hint}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* ------------------------------------------------------------- what for */}
      <h2 className={section}>{isSpecial ? "Course" : "Class"}</h2>
      {isSpecial ? (
        <>
          <label className="block">
            <span className="text-xs font-bold text-ink">Course name <span className="text-crimson-ink">*</span></span>
            <select
              name="courseName"
              required
              value={course}
              onChange={(e) => {
                setCourse(e.target.value);
                setLevelId("");
                void refreshFee("SPECIAL", { course: e.target.value });
              }}
              className={`mt-1.5 ${inputCls}`}
            >
              <option value="" disabled>Choose a course…</option>
              {courses.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          {levels.length > 0 && (
            <label className="block">
              <span className="text-xs font-bold text-ink">Level / track <span className="text-crimson-ink">*</span></span>
              <select
                key={course}
                name="courseLevelId"
                required
                value={levelId}
                onChange={(e) => {
                  setLevelId(e.target.value);
                  void refreshFee("SPECIAL", { course, level: e.target.value });
                }}
                className={`mt-1.5 ${inputCls}`}
              >
                <option value="" disabled>Choose a level…</option>
                {levels.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
              <span className="mt-1 block text-[11px] text-ink-soft">
                Not sure? Choose the first level — the teacher can move your child after the first class.
              </span>
            </label>
          )}
        </>
      ) : (
        <>
          <label className="block">
            <span className="text-xs font-bold text-ink">
              {isRegular ? "Applying for grade" : "Continuing in grade"} <span className="text-crimson-ink">*</span>
            </span>
            <select
              name="courseLevelId"
              required
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                void refreshFee(type, { cls: e.target.value });
              }}
              className={`mt-1.5 ${inputCls}`}
            >
              <option value="" disabled>Select…</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          {!isRegular && (
            <Field label="Student ID (e.g. BCSK-2026-0001)" name="studentId" required placeholder="BCSK-2026-0001" />
          )}
        </>
      )}

      <FeePanel type={type} fee={fee} loading={loadingFee} bcsk={bcsk} />

      {/* ------------------------------------------------------- applicant, common */}
      <h2 className={section}>{isSpecial ? "Applicant information" : "Student information"}</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={isSpecial ? "Applicant's full name" : "Student's full name"} name="applicantName" required autoComplete="name" />
        <Field label="Date of birth" name="dob" type="date" required />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <SelectField label="Gender" name="gender" required options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }]} />
        <SelectField
          label="Religion"
          name="religion"
          required
          options={["Islam", "Hinduism", "Christianity", "Buddhism", "Other"].map((r) => ({ value: r, label: r }))}
        />
      </div>
      {isSpecial && <Field label="Highest education (for adult programs)" name="highestEducation" />}
      <PhotoField label={type === "RE_ADMISSION" ? "Updated photo (optional, JPG/PNG, max 1 MB)" : undefined} required={type !== "RE_ADMISSION"} />
      <SelectField
        label="Learning mode"
        name="learningMode"
        options={[
          { value: "online", label: "Online" },
          { value: "hybrid", label: "Hybrid (online + in person)" },
        ]}
      />

      {!isSpecial && (
        <>
          <h2 className={section}>Guardian information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Father's name" name="fatherName" required={isRegular} />
            <Field label="Mother's name" name="motherName" required={isRegular} />
          </div>
          {isRegular && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Guardian profession" name="guardianProfession" />
              <Field label="Guardian education" name="guardianEducation" />
            </div>
          )}
        </>
      )}

      <h2 className={section}>Contact &amp; addresses</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Phone number" name="phone" required autoComplete="tel" placeholder="+82 10-…" />
        {isRegular ? <Field label="Second phone (optional)" name="guardianPhone2" /> : <span />}
      </div>
      <Field label="Email (confirmation is sent here)" name="email" type="email" required autoComplete="email" />
      <Field label={isRegular || type === "RE_ADMISSION" ? "Address in Korea" : "Address in Korea (optional)"} name="addressKorea" required={isRegular} />
      <Field label="Address in Bangladesh" name="addressBangladesh" required />
      <Field label="Emergency contact (name + phone)" name="emergencyContact" required />

      {isSpecial && (
        <label className="flex items-start gap-3 bg-green-soft rounded-xl p-4">
          <input type="checkbox" name="isBcskStudent" checked={bcsk} onChange={(e) => setBcsk(e.target.checked)} className="mt-0.5" />
          <span className="text-xs text-ink leading-relaxed">
            <span className="font-bold">The applicant is a current BCSK regular student.</span> BCSK students pay the
            discounted course fee (verified against school records).
          </span>
        </label>
      )}

      <ConsentField />
      {state?.error && <p className="text-sm text-red-600 font-semibold">{state.error}</p>}
      <Recaptcha siteKey={recaptchaSiteKey} />
      <button
        disabled={pending}
        className="w-full bg-crimson hover:bg-crimson-deep disabled:opacity-60 text-white font-bold rounded-lg px-6 py-3.5 text-sm transition-colors"
      >
        {pending ? "Submitting…" : "Continue to payment →"}
      </button>
    </form>
  );
}

/** The fee structure for the chosen grade or course, shown before anything is submitted. */
function FeePanel({ type, fee, loading, bcsk }: { type: RegistrationType; fee: FeePreviewState | null; loading: boolean; bcsk: boolean }) {
  const prompt = type === "SPECIAL" ? "Choose a course to see its fees." : "Choose a grade to see its fees.";
  return (
    <div className="rounded-xl border border-line bg-mist p-4" aria-live="polite">
      <p className="text-xs font-bold text-green uppercase tracking-wide">Fee structure</p>
      {loading ? (
        <p className="mt-2 text-sm text-ink-soft">Loading fees…</p>
      ) : !fee ? (
        <p className="mt-2 text-sm text-ink-soft">{prompt}</p>
      ) : "error" in fee ? (
        <p className="mt-2 text-sm text-red-600 font-semibold">{fee.error}</p>
      ) : (
        <>
          <p className="mt-1 text-sm font-bold text-ink">{fee.fee.title}</p>
          <div className={`mt-2 grid gap-3 ${fee.fee.options.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {fee.fee.options.map((o) => {
              const picked = fee.fee.options.length === 1 || (o.key === "bcsk") === bcsk;
              return (
                <dl key={o.key} className={`rounded-lg bg-white p-3 text-sm space-y-1 border ${picked ? "border-green" : "border-line opacity-70"}`}>
                  <dt className="text-xs font-bold text-ink-soft">{o.label}</dt>
                  {o.lines.map((l) => (
                    <div key={l.label} className="flex justify-between gap-3">
                      <dd className="text-ink-soft">{l.label}</dd>
                      <dd className="text-ink">{krw(l.amount)}</dd>
                    </div>
                  ))}
                  <div className="flex justify-between gap-3 border-t border-line pt-1 font-bold">
                    <dd className="text-ink">Total to pay</dd>
                    <dd className="text-green">{krw(o.total)}</dd>
                  </div>
                </dl>
              );
            })}
          </div>
          {fee.fee.bookFee ? (
            <p className="mt-2 text-[11px] text-ink-soft">Textbooks ({krw(fee.fee.bookFee)}) are not included in the total above.</p>
          ) : null}
        </>
      )}
    </div>
  );
}
