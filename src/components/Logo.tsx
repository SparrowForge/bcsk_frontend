import Image from "next/image";
import Link from "next/link";

/** The school's badge, served from `public/images/`. Same file the app icons are cut from. */
export const LOGO_SRC = "/images/bcsk-logo.png";

/**
 * BCSK logo — the school's official badge: the open-book-with-wings mark over the
 * Bangladesh flag disc, ringed by the school name and motto.
 *
 * Decorative on purpose (`alt=""`): every call site pairs it with the school name
 * as real text, so announcing the image again would only repeat that.
 */
export function LogoMark({ size = 40, priority = false }: { size?: number; priority?: boolean }) {
  return (
    <Image
      src={LOGO_SRC}
      alt=""
      width={size}
      height={size}
      priority={priority}
      className="shrink-0"
    />
  );
}

export function Logo({ variant = "dark", href = "/" }: { variant?: "dark" | "light"; href?: string }) {
  const ink = variant === "dark" ? "text-navy" : "text-white";
  const sub = variant === "dark" ? "text-ink-soft" : "text-sky-soft";
  return (
    <Link href={href} className="flex items-center gap-2.5 shrink-0" aria-label="BCSK — Home">
      {/* The dark variant is the sticky header on every surface — above the fold, so it
          loads eagerly; the light variant is the footer and can stay lazy. */}
      <LogoMark size={42} priority={variant === "dark"} />
      <span className="leading-tight">
        <span className={`block font-display font-semibold text-[15px] sm:text-base ${ink}`}>
          Bangladesh Community School
        </span>
        <span className={`block text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase ${sub}`}>
          Korea · কোরিয়া · 코리아
        </span>
      </span>
    </Link>
  );
}
