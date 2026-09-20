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
    var nodes = d.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < nodes.length; i++) nodes[i].setAttribute('data-revealed', '');
      return;
    }
    function apply(el) {
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight || d.documentElement.clientHeight;
      if (r.bottom <= 0 || r.top >= vh) {
        el.removeAttribute('data-revealed');
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
        apply(e.target);
      });
    }, { threshold: [0, 0.12] });
    for (var j = 0; j < nodes.length; j++) io.observe(nodes[j]);

    // Safety net. The observer reports *crossings*, so a flick that clears a mark and then
    // lands without crossing anything again would leave that element hidden for good — which
    // is the one failure this whole feature must not have. A sweep when the scrolling stops
    // costs one pass over the list and makes the resting state always correct.
    var t;
    function sweep() {
      for (var k = 0; k < nodes.length; k++) apply(nodes[k]);
    }
    addEventListener(
      'scroll',
      function () {
        clearTimeout(t);
        t = setTimeout(sweep, 120);
      },
      { passive: true },
    );
    addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(sweep, 120);
    });
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
