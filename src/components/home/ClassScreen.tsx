/**
 * The laptop on every classroom card.
 *
 * Deliberately a drawing and not a photograph or a live thumbnail: the card claims to be a
 * class in progress, and no real child's face belongs on the public homepage. The six tiles
 * read as a video-call grid at card size, which is the whole job.
 */
export function ClassScreen({ live, liveLabel }: { live: boolean; liveLabel: string }) {
  return (
    <div className="relative px-1.5 pt-1.5">
      <svg viewBox="0 0 100 74" className="w-full" aria-hidden>
        {/* lid */}
        <rect x="6" y="0" width="88" height="58" rx="3" fill="#0b5540" />
        <rect x="9" y="3" width="82" height="52" rx="1.5" fill="#12795c" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = 11 + (i % 3) * 27;
          const y = 5 + Math.floor(i / 3) * 25;
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <rect width="25" height="23" rx="1.5" fill="#ffffff" opacity="0.16" />
              <circle cx="12.5" cy="8.5" r="4" fill="#ffffff" opacity="0.55" />
              <path d="M4.5 20.5c0-4 3.6-6.8 8-6.8s8 2.8 8 6.8z" fill="#ffffff" opacity="0.55" />
            </g>
          );
        })}
        {/* base */}
        <rect x="0" y="59" width="100" height="6" rx="2.5" fill="#0b5540" />
        <rect x="42" y="59" width="16" height="2.4" rx="1.2" fill="#ffffff" opacity="0.35" />
      </svg>

      {live && (
        // `live-ring` spreads a soft red halo out of the badge, so a running class is
        // findable from across a board of twenty cards, not only by reading each label.
        <span className="live-ring absolute top-3 right-4 inline-flex items-center gap-1 rounded-full bg-red-600 px-1.5 py-[1px] text-[8px] font-extrabold text-white">
          <span className="w-1 h-1 rounded-full bg-white animate-pulse" aria-hidden />
          {liveLabel}
        </span>
      )}
    </div>
  );
}
