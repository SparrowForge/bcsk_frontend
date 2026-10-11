/**
 * The photo banner the school drew for its programme pages (Academic Curriculum, Islamic
 * Education in Korea, Abacus): copy on a light sheet at the left, a photograph at the right
 * that fades into the sheet, and the red-and-green swoosh of the flag along the foot.
 *
 * On a phone the photograph moves above the copy rather than behind it — text laid over a
 * photo at 320px is either unreadable or needs a scrim so heavy the photo is lost.
 *
 * The photographs in `public/images/banners/` are the ones from the school's reference
 * mockups, standing in until real BCSK photos replace them.
 */
export function PhotoBanner({
  image,
  imageAlt = "",
  imagePosition = "center",
  overlay,
  children,
}: {
  image: string;
  /** Empty when the photo is decoration — every banner photo so far is. */
  imageAlt?: string;
  imagePosition?: string;
  /** Drawn over the photo — the Abacus banner's handwritten slogan. */
  overlay?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-6">
      <div className="relative isolate overflow-hidden rounded-3xl border border-green/10 bg-white shadow-[0_18px_40px_-30px_rgba(0,77,57,0.7)]">
        <div className="grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          {/* `md:-ml-20` slides the photo under the copy column so the fade, not the photo's
              hard edge, is where the two meet. */}
          <div className="relative order-1 h-56 sm:h-72 md:order-2 md:-ml-20 md:h-auto md:min-h-[22rem]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={imageAlt}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: imagePosition }}
            />
            {/* The fade that lets the photo run into the sheet: from the left on a wide screen,
                from the bottom on a phone, where the copy sits underneath. */}
            {/* `-left-1` overlaps the photo's first pixels: started at exactly 0, the photo's
                antialiased edge showed through as a thin grey seam. */}
            <div aria-hidden className="absolute inset-y-0 -left-1 hidden w-2/5 bg-gradient-to-r from-white from-10% via-white/70 to-transparent md:block" />
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent md:hidden" />
            {overlay}
          </div>
          <div className="relative z-10 order-2 px-6 pb-16 pt-4 sm:px-10 md:order-1 md:py-12 md:pb-20 lg:px-12">
            {children}
          </div>
        </div>
        <Swoosh />
      </div>
    </section>
  );
}

/** The flag's two colours as one sweep along the banner's foot. */
function Swoosh() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 800 90"
      preserveAspectRatio="none"
      className="pointer-events-none absolute bottom-0 left-0 z-20 h-12 w-[85%] sm:h-16 md:w-[60%]"
    >
      <path d="M0 90V38c180 34 420 46 800 52H0Z" fill="var(--green-soft)" />
      <path d="M0 52c150 22 300 30 470 32" fill="none" stroke="var(--crimson)" strokeWidth="9" strokeLinecap="round" />
      <path d="M0 72c220 12 470 16 800 18H0Z" fill="var(--green)" />
    </svg>
  );
}

/** The two-colour rule under a banner title: a long green stroke and a short red one. */
export function BannerRule() {
  return (
    <span aria-hidden className="mt-4 flex gap-1.5">
      <span className="h-1 w-16 rounded-full bg-green" />
      <span className="h-1 w-8 rounded-full bg-crimson" />
    </span>
  );
}
