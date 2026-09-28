import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { FunAbacus } from "../FunAbacus";

export const metadata: Metadata = { title: "Fun Abacus" };

/** FR-ABC-07/08: Fun Abacus games; students' scores go to their progress report. */
export default async function AbacusFunPage() {
  const session = await getSession();
  const isStudent = session?.role === "STUDENT";

  return (
    <section className="mx-auto max-w-7xl px-4 mt-12">
      <div className="text-center mb-6">
        <h2 className="inline-block bg-abacus text-ink font-display text-2xl sm:text-3xl font-semibold rounded-lg px-5 py-1.5">
          Fun Abacus
        </h2>
        <p className="mt-3 text-sm text-ink-soft max-w-2xl mx-auto">
          Choose your level, pick a game and add the numbers on your mental abacus.{" "}
          {isStudent ? "Your scores are saved to your progress report." : "Log in as a student to save your scores."}
        </p>
      </div>
      <FunAbacus loggedIn={isStudent} />
    </section>
  );
}
