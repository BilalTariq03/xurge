export function revealUpOnScroll(
  target,
  {
    y = 50,
    duration = 1,
    ease = "power2.out",
    start = "top 80%",
    once = true
  } = {}
) {
  return gsap.fromTo(
    target,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      ease,
      scrollTrigger: {
        trigger: target,
        start,
        once
      }
    }
  );
}
