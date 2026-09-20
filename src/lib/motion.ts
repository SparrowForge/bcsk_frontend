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
 *   2. watches every `[data-reveal]` element and marks it `data-revealed` when it scrolls
 *      into view, once. Not a React component either, so a band animates as soon as the
 *      browser has laid it out instead of waiting for hydration — on a slow connection that
 *      is the difference between a lively page and a blank one.
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
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.setAttribute('data-revealed', '');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    for (var j = 0; j < nodes.length; j++) io.observe(nodes[j]);
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
