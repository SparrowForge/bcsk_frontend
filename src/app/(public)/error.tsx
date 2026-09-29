"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { dictionaries } from "@/lib/i18n/dictionaries";

/**
 * The public site's error boundary. It sits inside the public layout, so a page that fails
 * keeps the header and footer instead of dropping to Next's bare fallback.
 *
 * A client component cannot read the language cookie through `getDict`, but the root layout
 * has already written the language onto `<html lang>`. The server snapshot is English and
 * the browser corrects it right after hydration, which React treats as an update rather
 * than a mismatch.
 */
function useLang() {
  return useSyncExternalStore(
    () => () => {},
    () => document.documentElement.lang,
    () => "en",
  );
}

export default function PublicError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const lang = useLang();
  const t = dictionaries[lang === "bn" || lang === "ko" ? lang : "en"];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <div className="bg-mist rounded-3xl px-6 sm:px-12 py-14 sm:py-20 text-center">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-ink">{t.errors.errorTitle}</h1>
        <p className="mt-4 mx-auto max-w-xl text-ink-soft leading-relaxed">{t.errors.errorBody}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => retry()}
            className="press bg-green hover:bg-green-deep text-white font-bold rounded-lg border-2 border-transparent px-6 py-2.5 text-sm transition-colors"
          >
            {t.errors.retry}
          </button>
          <Link
            href="/"
            className="press bg-white hover:bg-green-soft text-green font-bold rounded-lg border-2 border-green/15 px-6 py-2.5 text-sm transition-colors"
          >
            {t.errors.backHome}
          </Link>
        </div>
        {error.digest && <p className="mt-6 text-xs text-ink-soft">Ref: {error.digest}</p>}
      </div>
    </div>
  );
}
