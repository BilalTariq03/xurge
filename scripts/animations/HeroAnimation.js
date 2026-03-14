import { AnimationBase } from '../core/base.js';

export class HeroAnimation extends AnimationBase {
  init() {
    this.setupVideoAnimation();
  }

  setupVideoAnimation() {
    if (!this.mm) this.mm = gsap.matchMedia();

    this.mm.add("(min-width: 990px)", () => {
      const trigger = gsap.fromTo('.animation-container',
        { clipPath: 'inset(0 5% round 0.5rem)' },
        {
          clipPath: 'inset(0 0% round 0rem)',
          ease: "power2.out",
          scrollTrigger: {
            trigger: '.animation-container-wrapper',
            start: "top center",
            end: "+=500",
            pin: false,
            anticipatePin: false,
            scrub: true,
            invalidateOnRefresh: true
          }
        }
      );
      return () => trigger.scrollTrigger && trigger.scrollTrigger.kill();
    });

    this.mm.add("(max-width: 990px)", () => {
      const trigger = gsap.fromTo('.animation-container',
        { clipPath: 'inset(0 8% round 0.5rem)' },
        {
          clipPath: 'inset(0 0% round 0rem)',
          ease: "power2.out",
          scrollTrigger: {
            trigger: '.animation-container-wrapper',
            start: "top top",
            end: "+=500",
            pin: true,
            anticipatePin: true,
            scrub: true,
            invalidateOnRefresh: true
          }
        }
      );
      return () => trigger.scrollTrigger && trigger.scrollTrigger.kill();
    });
  }
}
