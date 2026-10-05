import { startTransition, useEffect, useRef, type FormEvent, type RefObject } from "react";

/**
 * Submit a form to a Server Action without React 19's automatic form reset.
 *
 * `<form action={fn}>` clears every uncontrolled field once the action settles - on success,
 * which is often wanted, but also on a server-side rejection (rate limit, age rule, wrong
 * password), which wiped whatever the person had typed and made them start again. Posting from
 * `onSubmit` instead keeps what they typed. Forms that *should* clear after a save say so with
 * `resetOnSuccess`, so the reset happens only when the action reports `ok`.
 *
 * Usage, with `[state, action, pending] = useActionState(...)`:
 *
 *   const kept = useKeptForm(action, state);                       // keep values always
 *   const kept = useKeptForm(action, state, { resetOnSuccess: true }); // clear after a save
 *   <form {...kept} className="...">
 */
export function keepForm(dispatch: (formData: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLElement | null;
    const data = new FormData(event.currentTarget, submitter);
    startTransition(() => dispatch(data));
  };
}

type ResultLike = { ok?: boolean | string; error?: string } | null | undefined;

export function useKeptForm(
  dispatch: (formData: FormData) => void,
  state: ResultLike,
  options: { resetOnSuccess?: boolean } = {},
): { ref: RefObject<HTMLFormElement | null>; onSubmit: (e: FormEvent<HTMLFormElement>) => void } {
  const ref = useRef<HTMLFormElement>(null);
  const { resetOnSuccess = false } = options;
  // Each submission returns a fresh state object, so this fires once per successful save.
  useEffect(() => {
    if (resetOnSuccess && state?.ok) ref.current?.reset();
  }, [state, resetOnSuccess]);
  return { ref, onSubmit: keepForm(dispatch) };
}
