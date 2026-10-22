"use client";

import { useState } from "react";
import { ActionForm, field, label } from "@/components/admin/ActionForm";
import { createSlot, updateSlot } from "./actions";

export const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

type Assignment = { subjectId: number; teacherProfileId: number; teacherName: string };

function TeacherSelect({ assignments, subjectId, value }: { assignments: Assignment[]; subjectId: number | null; value?: number | null }) {
  const options = assignments.filter((a) => a.subjectId === subjectId);
  return (
    <label className={label}>
      Teacher
      <select name="teacherProfileId" defaultValue={value ?? ""} key={subjectId ?? "none"} className={`mt-1 block ${field}`}>
        <option value="">{options.length === 1 ? `${options[0]!.teacherName} (assigned)` : "Assigned teacher, if only one"}</option>
        {options.map((a) => <option key={a.teacherProfileId} value={a.teacherProfileId}>{a.teacherName}</option>)}
      </select>
    </label>
  );
}

function TimeFields({ day = "Saturday", start = "", end = "", room = "", zoom = "" }: { day?: string; start?: string; end?: string | null; room?: string | null; zoom?: string | null }) {
  return (
    <>
      <label className={label}>
        Day
        <select name="dayOfWeek" defaultValue={day} className={`mt-1 block ${field}`}>{DAYS.map((d) => <option key={d}>{d}</option>)}</select>
      </label>
      <label className={label}>Starts<input name="startTime" type="time" required defaultValue={start} className={`mt-1 block ${field}`} /></label>
      <label className={label}>Ends<input name="endTime" type="time" required defaultValue={end ?? ""} className={`mt-1 block ${field}`} /></label>
      <label className={label}>Room<input name="room" defaultValue={room ?? ""} placeholder="Online" className={`mt-1 block w-28 ${field}`} /></label>
      <label className={label}>Meeting link<input name="zoomLink" type="url" defaultValue={zoom ?? ""} placeholder="https://" className={`mt-1 block w-48 ${field}`} /></label>
    </>
  );
}

/** Add a slot: the subject chosen narrows the teacher list to those assigned it in this section. */
export function AddSlotForm({ sectionId, subjects, assignments }: {
  sectionId: number;
  subjects: { id: number; name: string }[];
  assignments: Assignment[];
}) {
  const [subjectId, setSubjectId] = useState<number | null>(null);
  return (
    <ActionForm action={createSlot} submit="Add to routine" resetOnSuccess>
      <input type="hidden" name="sectionId" value={sectionId} />
      <label className={label}>
        Subject
        <select name="subjectId" required defaultValue="" onChange={(e) => setSubjectId(Number(e.target.value) || null)} className={`mt-1 block ${field}`}>
          <option value="" disabled>Choose…</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </label>
      <TeacherSelect assignments={assignments} subjectId={subjectId} />
      <TimeFields />
    </ActionForm>
  );
}

export function EditSlotForm({ slot, assignments }: {
  slot: { id: number; subjectId: number | null; teacherId: number | null; dayOfWeek: string; startTime: string; endTime: string | null; room: string | null; zoomLink: string | null; notice: string | null };
  assignments: Assignment[];
}) {
  return (
    <ActionForm action={updateSlot} submit="Save" variant="quiet" className="flex flex-wrap items-end gap-3 pt-3">
      <input type="hidden" name="slotId" value={slot.id} />
      <TeacherSelect assignments={assignments} subjectId={slot.subjectId} value={slot.teacherId} />
      <TimeFields day={slot.dayOfWeek} start={slot.startTime} end={slot.endTime} room={slot.room} zoom={slot.zoomLink} />
      <label className={label}>Notice<input name="notice" defaultValue={slot.notice ?? ""} className={`mt-1 block w-48 ${field}`} /></label>
    </ActionForm>
  );
}
