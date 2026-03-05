import { AnimationBase } from "../core/base.js";
import { charReveal, AddSpans } from "../utils/text-utils.js";
import { revealUpOnScroll } from "../utils/reveal-text.js";

export class clientAnimation extends AnimationBase {
  init() {
    AddSpans('.clients-container .title', 'title-char');
    charReveal('title-char', 'clients-container .title');

    this.textFloatAnimation();
    this.logoFloatAnimation();
  }

  textFloatAnimation() {
    const el = document.querySelector('.clients-container .description');
    if (!el) return;
    const { observer } = revealUpOnScroll(el);
    if (observer) {
      this._observers = this._observers || [];
      this._observers.push(observer);
    }
  }

  logoFloatAnimation() {
    const clientLogos = document.querySelectorAll('.client-logo');
    if (!clientLogos.length) return;

    gsap.set(clientLogos, { y: 50, opacity: 0 });

    this._observers = this._observers || [];

    clientLogos.forEach(logo => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            gsap.to(logo, { y: 0, opacity: 1, duration: 1, ease: 'power2.out' });
            observer.unobserve(logo);
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
      );

      observer.observe(logo);
      this._observers.push(observer);
    });
  }

  cleanup() {
    (this._observers || []).forEach(o => o.disconnect());
    this._observers = [];
    super.cleanup();
  }
}