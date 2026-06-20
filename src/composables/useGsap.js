/**
 * useGsap.js — Shared GSAP animation composable
 *
 * Wraps common GSAP patterns so views/components import
 * from here instead of GSAP directly. All animations respect
 * prefers-reduced-motion via gsap.matchMedia().
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Accessibility: honour prefers-reduced-motion
// ---------------------------------------------------------------------------
const mm = gsap.matchMedia();

/**
 * Run a setup function inside a matchMedia context so GSAP automatically
 * applies reduced-motion alternatives.
 *
 * @param {(context: { isReduced: boolean }) => void} setupFn
 */
export function withMotionPreference(setupFn) {
  mm.add(
    {
      isReduced: "(prefers-reduced-motion: reduce)",
      isMotion: "(prefers-reduced-motion: no-preference)",
    },
    (ctx) => {
      setupFn(ctx.conditions);
    }
  );
}

// ---------------------------------------------------------------------------
// Stagger reveal  (scroll-triggered, for card lists)
// ---------------------------------------------------------------------------
/**
 * Animate a list of elements in with a stagger as they enter the viewport.
 *
 * @param {string | Element | Element[]} targets - CSS selector or element(s)
 * @param {object} [opts]
 * @param {number} [opts.stagger=0.04]
 * @param {number} [opts.y=28]
 * @param {number} [opts.duration=0.55]
 * @param {string} [opts.ease="power2.out"]
 * @param {boolean} [opts.scrollTrigger=true]  use ScrollTrigger or just play immediately
 * @returns {gsap.core.Tween | null}
 */
export function staggerReveal(targets, opts = {}) {
  const {
    stagger = 0.04,
    y = 28,
    duration = 0.55,
    ease = "power2.out",
    useScrollTrigger = true,
  } = opts;

  if (!targets) return null;

  const scrollTriggerConfig = useScrollTrigger
    ? {
        scrollTrigger: {
          trigger:
            typeof targets === "string" ? targets : targets[0] ?? targets,
          start: "top 92%",
          once: true,
        },
      }
    : {};

  return gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      ease,
      stagger,
      clearProps: "transform",
      ...scrollTriggerConfig,
    }
  );
}

// ---------------------------------------------------------------------------
// Sidebar slide-in  (from left)
// ---------------------------------------------------------------------------
/**
 * Slide an element in from the left.
 *
 * @param {Element} el
 * @param {object} [opts]
 * @returns {gsap.core.Tween}
 */
export function slideInLeft(el, opts = {}) {
  const { duration = 0.38, ease = "power3.out", x = -320 } = opts;
  return gsap.fromTo(
    el,
    { x, opacity: 0 },
    { x: 0, opacity: 1, duration, ease, clearProps: "transform,opacity" }
  );
}

/**
 * Slide an element out to the right.
 *
 * @param {Element} el
 * @param {Function} [onComplete]
 * @returns {gsap.core.Tween}
 */
export function slideOutRight(el, onComplete) {
  return gsap.to(el, {
    x: 320,
    opacity: 0,
    duration: 0.28,
    ease: "power2.in",
    onComplete,
  });
}

// ---------------------------------------------------------------------------
// Backdrop fade
// ---------------------------------------------------------------------------
export function fadeIn(el, duration = 0.2) {
  return gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration });
}

export function fadeOut(el, onComplete, duration = 0.18) {
  return gsap.to(el, { opacity: 0, duration, onComplete });
}

// ---------------------------------------------------------------------------
// Modal spring pop
// ---------------------------------------------------------------------------
/**
 * Animate a modal panel in with a spring scale effect.
 *
 * @param {Element} el
 * @returns {gsap.core.Tween}
 */
export function popIn(el) {
  return gsap.fromTo(
    el,
    { scale: 0.88, opacity: 0, y: 24 },
    {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 0.42,
      ease: "back.out(1.4)",
      clearProps: "transform,opacity",
    }
  );
}

/**
 * Animate a modal panel out.
 *
 * @param {Element} el
 * @param {Function} [onComplete]
 * @returns {gsap.core.Tween}
 */
export function popOut(el, onComplete) {
  return gsap.to(el, {
    scale: 0.9,
    opacity: 0,
    y: 16,
    duration: 0.22,
    ease: "power2.in",
    onComplete,
  });
}

// ---------------------------------------------------------------------------
// Button micro-pop  (click feedback)
// ---------------------------------------------------------------------------
/**
 * Quick elastic scale pop on a button/icon element.
 *
 * @param {Element} el
 */
export function buttonPop(el) {
  gsap
    .timeline()
    .to(el, { scale: 1.32, duration: 0.12, ease: "power2.out" })
    .to(el, { scale: 1, duration: 0.38, ease: "elastic.out(1.1, 0.5)" });
}

/**
 * Wiggle animation — used for un-bookmarking.
 *
 * @param {Element} el
 */
export function wiggle(el) {
  gsap
    .timeline()
    .to(el, { rotation: -18, duration: 0.08, ease: "power1.out" })
    .to(el, { rotation: 14, duration: 0.08, ease: "power1.inOut" })
    .to(el, { rotation: -8, duration: 0.07, ease: "power1.inOut" })
    .to(el, { rotation: 0, duration: 0.07, ease: "power1.in" });
}

/**
 * Spin 360° + scale pop — used for the tafsir icon button.
 *
 * @param {Element} el
 */
export function spinPop(el) {
  gsap
    .timeline()
    .to(el, { rotation: 360, scale: 1.25, duration: 0.35, ease: "power2.out" })
    .to(el, { rotation: 360, scale: 1, duration: 0.2, ease: "elastic.out(1, 0.5)" })
    .set(el, { rotation: 0 });
}

// ---------------------------------------------------------------------------
// Audio player spring
// ---------------------------------------------------------------------------
/**
 * Spring the floating audio bar up from below.
 *
 * @param {Element} el
 */
export function audioBarEnter(el) {
  gsap.fromTo(
    el,
    { y: 80, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.5)", clearProps: "transform,opacity" }
  );
}

/**
 * Slide the floating audio bar back down.
 *
 * @param {Element} el
 * @param {Function} [onComplete]
 */
export function audioBarLeave(el, onComplete) {
  gsap.to(el, { y: 80, opacity: 0, duration: 0.28, ease: "power2.in", onComplete });
}

// ---------------------------------------------------------------------------
// Route page transition helpers
// ---------------------------------------------------------------------------
export function pageEnter(el, done) {
  gsap.fromTo(
    el,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.28, ease: "power2.out", onComplete: done, clearProps: "transform,opacity" }
  );
}

export function pageLeave(el, done) {
  gsap.to(el, { opacity: 0, y: -10, duration: 0.16, ease: "power2.in", onComplete: done });
}

// ---------------------------------------------------------------------------
// Expand / Collapse  (for ReadingToolbar settings panel)
// ---------------------------------------------------------------------------
/**
 * Animate height from 0 to auto for expandable panels.
 *
 * @param {Element} el
 */
export function expandPanel(el) {
  gsap.fromTo(
    el,
    { height: 0, opacity: 0 },
    { height: "auto", opacity: 1, duration: 0.28, ease: "power2.out", overflow: "hidden", clearProps: "height,overflow" }
  );
}

export function collapsePanel(el, onComplete) {
  gsap.to(el, {
    height: 0,
    opacity: 0,
    duration: 0.2,
    ease: "power2.in",
    overflow: "hidden",
    onComplete,
  });
}
