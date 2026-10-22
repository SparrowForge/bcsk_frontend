import "server-only";
import { revalidatePath } from "next/cache";
import { toActionError } from "@/services";

/**
 * The tail every academic-setup Server Action shares (LMS F1): call the API, turn a refusal
 * into the form's message, and refresh the pages that show the change.
 *
 * It deliberately does not authorise. Each action calls its own `require*` guard first, in its
 * own body - an action is a public endpoint, and `tests/unit/action-guards.test.ts` checks
 * every one for it.
 */
export async function attempt(fn: () => Promise<unknown>, paths: string[]): Promise<{ ok?: boolean; error?: string }> {
  try {
    await fn();
  } catch (e) {
    return toActionError(e);
  }
  for (const p of paths) revalidatePath(p);
  return { ok: true };
}
