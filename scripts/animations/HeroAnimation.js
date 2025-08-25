import { AnimationBase } from '../core/base.js';

export class HeroAnimation extends AnimationBase {
  init() {
    this.setupAnimationContainer();
    this.setupXurgeAnimation();
  }

  setupAnimationContainer() {
    const trigger = gsap.to('.animation-container', {
      scale: 1.12,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".animation-container",
        start: "top center",
        end: "top top",
        scrub: true,
        invalidateOnRefresh: true
      }
    });

    this.registerTrigger(trigger.scrollTrigger);
  }

  setupXurgeAnimation() {
    if (!this.mm) this.mm = gsap.matchMedia();

    this.mm.add("(min-width: 990px)", () => {
      const trigger = gsap.fromTo('.xurge-animation', 
        { y: '100vh', scale: '1' },
        {
          y: '0vh',
          scale: '4',
          ease: "power1.out",
          scrollTrigger: {
            trigger: '.animation-container-wrapper',
            start: "top top",
            end: "+=2000",
            pin: true,
            anticipatePin: true,
            scrub: true,
            invalidateOnRefresh: true
          }
        }
      );
      return () => trigger.scrollTrigger && trigger.scrollTrigger.kill();
    });

    this.mm.add("(max-width: 990px)", () => {
      const trigger = gsap.fromTo('.xurge-animation', 
        { y: '70vh', scale: '1' },
        {
          y: '15vh',
          scale: '4',
          ease: "power1.out",
          scrollTrigger: {
            trigger: '.animation-container-wrapper',
            start: "top top",
            end: "+=1000",
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