import type { CSSProperties } from "react";

/**
 * The scroll-reveal runtime — deliberately 20 lines of inline script rather than a
 * component.
 *
 * It runs in the document head, before the browser paints anything, and does two jobs:
 *
 *   1. sets `data-motion` on `<html>`, which is what arms every rule in the motion block of
 *      `globals.css`. Doing it here rather than in a `useEffect` is the whole point: an
 *      effect runs *after* the first paint, so the page would flash its content and then
 *      hide it again to animate. A no-script visitor never gets the attribute and therefore
 *      never gets the hidden state — the homepage stays fully readable.
 *
 *   2. marks every `[data-reveal]` element `data-revealed` while it is in view and clears the
 *      mark once it has left completely, so the entrance replays each time the reader scrolls
 *      back to it rather than firing once per page load. Not a React component either, so a
 *      band animates as soon as the browser has laid it out instead of waiting for hydration
 *      — on a slow connection that is the difference between a lively page and a blank one.
 *
 * The two thresholds are what keep a replaying reveal from flickering: an element has to be
 * 12% visible before it animates in, but it is only reset once it is *entirely* gone. Without
 * that gap, anything parked at the edge of the viewport would fade in and out on every small
 * scroll. Tall elements — ones that can never show 12% of themselves — animate as soon as
 * they appear.
 *
 * Editing the DOM ahead of hydration is what `suppressHydrationWarning` exists for, and both
 * marks need it: React compares the root element's attributes, and it compares every
 * `data-revealed` the observer set before hydration against a payload that has none. `<html>`
 * carries the flag in the root layout; every revealing element gets it from `reveal()` below.
 *
 * Anything it cannot do — an ancient browser with no IntersectionObserver — reveals
 * everything immediately, which is the pre-animation page.
 */
export const MOTION_BOOTSTRAP = `
(function () {
  var d = document;
  d.documentElement.setAttribute('data-motion', 'on');
  function start() {
    if (!('IntersectionObserver' in window)) {
      var bare = d.querySelectorAll('[data-reveal]');
      for (var i = 0; i < bare.length; i++) bare[i].setAttribute('data-revealed', '');
      return;
    }
    // mayHide is false for an element we have only just met. A node React has inserted but not
    // yet laid out measures as a zero rect, which reads as "off screen" and would strip the
    // mark straight back off — that is what left the headline invisible after a Back press.
    // Newly seen elements may therefore only be revealed, never hidden; the sweep that follows
    // decides properly once layout exists.
    function apply(el, mayHide) {
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight || d.documentElement.clientHeight;
      if (r.bottom <= 0 || r.top >= vh) {
        if (mayHide) el.removeAttribute('data-revealed');
        return;
      }
      var shown = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      if (!r.height || shown / r.height >= 0.12 || r.height > vh * 0.6) {
        el.setAttribute('data-revealed', '');
      }
    }
    var io = new IntersectionObserver(function (entries) {
      // Measured here, not read from the entry. An entry describes where the element was
      // when the crossing was recorded, and the callback can run after a fast scroll has
      // moved it somewhere else — a stale "not intersecting" would then hide an element
      // that is back on screen, with no further crossing left to undo it.
      entries.forEach(function (e) {
        apply(e.target, true);
      });
    }, { threshold: [0, 0.12] });

    function track(el) {
      io.observe(el);
      // Revealed at once rather than waiting for the observer, so an element that arrives
      // already on screen does not spend a frame invisible.
      apply(el, false);
    }
    function scan(root) {
      if (!root || root.nodeType !== 1) return;
      if (root.hasAttribute('data-reveal')) track(root);
      var found = root.querySelectorAll('[data-reveal]');
      for (var n = 0; n < found.length; n++) track(found[n]);
    }
    scan(d.body);

    // Safety net. The observer reports *crossings*, so a flick that clears a mark and then
    // lands without crossing anything again would leave that element hidden for good — which
    // is the one failure this whole feature must not have. A sweep when the scrolling stops
    // re-queries the document (never a stale list) and makes the resting state always correct.
    var t;
    function sweep() {
      var all = d.querySelectorAll('[data-reveal]');
      for (var k = 0; k < all.length; k++) apply(all[k], true);
    }
    function sweepSoon() {
      clearTimeout(t);
      t = setTimeout(sweep, 120);
    }

    // A client-side navigation does not reload the page: React throws away these elements and
    // builds new ones, which arrive carrying data-reveal and therefore hidden. Observing only
    // what existed at startup left the homepage blank after a visitor pressed Back — the bug
    // this watcher exists to prevent. Observing an element twice is a no-op, so re-scanning
    // costs nothing.
    new MutationObserver(function (muts) {
      var seen = false;
      for (var m = 0; m < muts.length; m++) {
        var added = muts[m].addedNodes;
        for (var a = 0; a < added.length; a++) {
          if (added[a].nodeType === 1) {
            scan(added[a]);
            seen = true;
          }
        }
      }
      // Then settle: the reveal above was made blind to layout on purpose, so one sweep after
      // the insertion has been laid out is what puts the off-screen half back to hidden.
      if (seen) sweepSoon();
    }).observe(d.body, { childList: true, subtree: true });

    addEventListener('scroll', sweepSoon, { passive: true });
    addEventListener('resize', sweepSoon);
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start);
  else start();
})();
`;

/** The entrances `globals.css` defines. `up` is the default and the one to reach for. */
export type RevealKind = "up" | "left" | "right" | "zoom" | "fade";

type RevealProps = {
  "data-reveal": RevealKind;
  style: CSSProperties;
  suppressHydrationWarning: true;
};

/**
 * Opt an element into the scroll reveal: `<li {...reveal("zoom", i, 55)}>`.
 *
 * `index` and `step` turn a grid of cards into a run rather than a single flash. The delay is
 * capped on purpose: a twelve-tile row staggered at 70ms apiece would still be arriving a
 * second after the reader got there, so late items catch up with the ones before them.
 */
export function reveal(kind: RevealKind = "up", index = 0, step = 70, cap = 420): RevealProps {
  return {
    "data-reveal": kind,
    style: { "--reveal-delay": `${Math.min(index * step, cap)}ms` } as CSSProperties,
    suppressHydrationWarning: true,
  };
}
