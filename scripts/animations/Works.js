import { AnimationBase } from "../core/base.js";

export class WorksAnimation extends AnimationBase {
  init() {
    this.setupWorksHeroText();
    this.setupHorizontalScroll();
    this.smoothItemScroll();
  }

  setupWorksHeroText() {
    const el = document.querySelector(".works-hero-text");
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 30 });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        gsap.to(el, { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" });
        observer.unobserve(el);
      });
    }, { threshold: 0.1 });

    observer.observe(el);
    this._observers = this._observers || [];
    this._observers.push(observer);
  }

  setupHorizontalScroll() {
  if (this.mm) this.mm.revert();
  this.mm = gsap.matchMedia();

  this.mm.add("(min-width: 990px)", () => {
    const hero = document.querySelector('.works-container');
    const wrapper = document.querySelector('.scroll-wrapper');
    const workList = document.querySelector('.work-item-list');
    if (!hero || !wrapper || !workList) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.works-section',
        start: 'top top',
        end: () => `+=${(wrapper.scrollWidth - window.innerWidth) * 3.0}`, // ← lazy, recalculates on refresh
        scrub: true,
        pin: true,
        anticipatePin: true,
        invalidateOnRefresh: true,
        onRefresh: () => gsap.set(workList, { x: 0 }),
      }
    })
      .to(hero, { filter: 'blur(8px)', duration: 0.2 }, 0.05)
      .to(workList, { x: () => `-${wrapper.scrollWidth - window.innerWidth}px`, ease: 'none' }, 0);

    this.registerTrigger(tl.scrollTrigger);

    if (document.readyState === 'complete') {
      ScrollTrigger.refresh();
    } else {
      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    }

    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  });
}

  smoothItemScroll() {
    const workItems = document.querySelectorAll('.item-container');
    if (!workItems.length) return;

    // Set hidden state immediately
    gsap.set(workItems, { opacity: 0, y: 50 });

    this._observers = this._observers || [];

    workItems.forEach(item => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            gsap.to(entry.target, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
      );

      observer.observe(item);
      this._observers.push(observer);
    });
  }

  cleanup() {
    this.mm?.revert();
    this.mm = null;
    (this._observers || []).forEach(o => o.disconnect());
    this._observers = [];
    super.cleanup();
  }
}