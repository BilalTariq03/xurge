import { AnimationBase } from "../core/base.js";

export class StatsAnimation extends AnimationBase {
  init() {
    const counters = document.querySelectorAll('.stats-heading');
    const statsSection = document.querySelector('.stats-section');
    if (!counters.length || !statsSection) return;

    // Set initial display state
    counters.forEach(counter => { counter.textContent = '0' + (counter.id === 'percent' ? '%' : '+'); });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          observer.unobserve(statsSection);

          counters.forEach(counter => {
            const target = +counter.dataset.target;
            const isPercent = counter.id === 'percent';

            gsap.fromTo(
              counter,
              { innerText: 0 },
              {
                innerText: target,
                duration: 3,
                ease: 'power1.out',
                snap: { innerText: 1 },
                onUpdate() {
                  counter.textContent = Math.round(counter.innerText) + (isPercent ? '%' : '+');
                },
              }
            );
          });
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(statsSection);
    this._observer = observer;
  }

  cleanup() {
    this._observer?.disconnect();
    super.cleanup();
  }
}