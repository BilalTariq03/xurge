/**
 * revealUpOnScroll — uses IntersectionObserver instead of ScrollTrigger.
 *
 * ScrollTrigger pre-calculates positions at init time, which gives wrong
 * results on JSON-rendered pages where images shift the layout after load.
 * IntersectionObserver fires at the real current viewport position, always.
 */
export function revealUpOnScroll(
  target,
  {
    y = 50,
    duration = 1.5,
    ease = 'power2.out',
    threshold = 0.1,
    rootMargin = '0px 0px -10% 0px',
  } = {}
) {
  if (!target) return { disconnect: () => {} };

  // Set hidden state immediately
  gsap.set(target, { y, opacity: 0 });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        gsap.to(target, { y: 0, opacity: 1, duration, ease });
        observer.unobserve(target); // fire once
      });
    },
    { threshold, rootMargin }
  );

  observer.observe(target);

  // Return the observer so callers can disconnect if needed
  return { observer, disconnect: () => observer.disconnect() };
}