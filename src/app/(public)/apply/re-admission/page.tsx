import { redirect } from "next/navigation";

/** The old per-type application URL: the one form at /apply now covers every registration type. */
export default async function Page({ searchParams }: { searchParams: Promise<{ course?: string }> }) {
  const { course } = await searchParams;
  redirect(`/apply?type=re-admission&${course ? `course=${encodeURIComponent(course)}` : ""}`);
}
