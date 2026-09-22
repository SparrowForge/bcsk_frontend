import Image from "next/image";
import Link from "next/link";
import { SCHOOL } from "@/lib/constants";

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
  // The deck sets both lines in the same dark ink, the Bangla name as prominent as the
  // English one rather than as a muted strapline.
  const sub = variant === "dark" ? "text-navy" : "text-sky-soft";
  return (
    // The size steps three times, and each step is a width problem rather than a taste one:
    // the nav sets the header's height and cannot shrink, so the name is what gives way. At
    // 15px it outruns the row between the lg breakpoint and xl — where most laptops sit — so
    // it holds 14px through that band, and 11.5px on a phone, where the badge and the menu
    // button leave it barely 220px.
    //
    // `min-w-0` rather than `shrink-0`: the masthead is the widest thing in a 375px
    // header, and a name that cannot yield pushes the menu button off the screen — which is
    // exactly what happened when the Bangla line moved to SolaimanLipi and grew to the width
    // of the English one. It now shrinks first, and `truncate` is the floor under that, so
    // no future name, font or language can put the page into sideways scroll.
    <Link href={href} className="flex items-center gap-2.5 min-w-0" aria-label="BCSK — Home">
      {/* The dark variant is the sticky header on every surface — above the fold, so it
          loads eagerly; the light variant sits on the portal shells and can stay lazy. */}
      <LogoMark size={42} priority={variant === "dark"} />
      <span className="leading-tight min-w-0">
        <span className={`block truncate font-display font-semibold text-[11.5px] sm:text-[14px] xl:text-[15px] ${ink}`}>
          {SCHOOL.name}
        </span>
        <span className={`block truncate text-[11.5px] sm:text-[14px] xl:text-[15px] font-bold ${sub}`} lang="bn">
          {SCHOOL.nameBn}
        </span>
      </span>
    </Link>
  );
}
