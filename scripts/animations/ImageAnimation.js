import { AnimationBase } from "../core/base.js";

export class ImageAnimation extends AnimationBase {
  init() {
    this.smoothImageScroll();
  }

  smoothImageScroll() {
    const images = document.querySelectorAll('.img-anim');
    if (!images.length) return;

    // Hide all images immediately before anything is measured
    gsap.set(images, { opacity: 0, y: 50 });

    // IntersectionObserver fires based on the REAL current position in the
    // viewport — it doesn't pre-calculate at init time like ScrollTrigger does,
    // so it's immune to layout shifts caused by lazy-loading images above.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
          });

          // Stop watching once animated
          observer.unobserve(entry.target);
        });
      },
      {
        // Fire when 10% of the image enters the viewport.
        threshold: 0.1,

        // Shrink the effective viewport by 15% from the bottom,
        // so the image needs to scroll further in before animating.
        rootMargin: '0px 0px -15% 0px',
      }
    );

    images.forEach(img => observer.observe(img));

    // Store observer so cleanup() can disconnect it
    this._observer = observer;
  }

  cleanup() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    super.cleanup();
  }
}