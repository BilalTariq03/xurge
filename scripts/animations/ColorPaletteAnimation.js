import { AnimationBase } from '../core/base.js';

export class ColorPaletteAnimation extends AnimationBase {
  init() {
    this.setupColorAnimations();
  }

  setupColorAnimations() {
    const primaryColors   = gsap.utils.toArray('.color-primary');
    const secondaryColors = gsap.utils.toArray('.color-secondary');

    if (primaryColors.length) {
      gsap.set(primaryColors, { scaleX: 0, opacity: 0, transformOrigin: 'left center' });
      this._observeGroup(
        document.querySelector('.color-group-primary'),
        () => gsap.to(primaryColors, {
          scaleX: 1, opacity: 1, duration: 0.8,
          ease: 'power3.out', stagger: 0.1,
        })
      );
    }

    if (secondaryColors.length) {
      gsap.set(secondaryColors, { scaleY: 0, opacity: 0, transformOrigin: 'center top' });
      this._observeGroup(
        document.querySelector('.color-group-secondary'),
        () => gsap.to(secondaryColors, {
          scaleY: 1, opacity: 1, duration: 0.6,
          ease: 'power3.out', stagger: 0.08,
        })
      );
    }
  }

  // Watches a container element and fires the callback once when it enters the viewport
  _observeGroup(el, onEnter) {
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          onEnter();
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(el);
    this._observers = this._observers || [];
    this._observers.push(observer);
  }

  cleanup() {
    (this._observers || []).forEach(o => o.disconnect());
    this._observers = [];
    super.cleanup();
  }
}