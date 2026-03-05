import { initSmoothScrolling } from "./core/scroll.js";
import { initCustomCursor } from "./core/cursor.js";
import { prepareHeroText } from "./utils/text-utils.js";
import { animateHeroText } from "./animations/heroText.js";
import { initPageTransitions } from "./core/pageTransition.js";

class AnimationManager {
  constructor() {
    this.animations = new Map();
    this.cursor = null;
    this.lenis = null;
  }

  async init() {
    this.lenis = initSmoothScrolling();
    this.cursor = initCustomCursor();
    gsap.registerPlugin(ScrollTrigger);
    initPageTransitions();

    await this.initializeAnimations();

    this.setupHoverEffects();
    setTimeout(() => this.restoreScrollPosition(), 100);
  }

  async initializeAnimations() {
    prepareHeroText();
    await new Promise(resolve => requestAnimationFrame(resolve));

    // ── Step 1: Works animation first (it sets up the pin + ScrollTrigger) ──
    if (document.querySelector('.works-grid') || document.querySelector('.works-section')) {
      const { WorksAnimation } = await import('./animations/Works.js');
      const a = new WorksAnimation();
      a.init();
      this.animations.set('works', a);
    }

    // ── Step 2: Wait for Works' internal ScrollTrigger.refresh() to finish ──
    // Works.js calls setTimeout(ScrollTrigger.refresh, 500) internally.
    // We wait for that + one more frame so the pin spacer is fully inserted
    // and all element positions are settled before anything else inits.
    await new Promise(resolve => setTimeout(resolve, 600));
    await new Promise(resolve => requestAnimationFrame(resolve));

    // ── Step 3: Everything else can now init safely in parallel ──────────
    await Promise.all([

      document.querySelector('.clients-container') && import('./animations/clientAnimation.js').then(({ clientAnimation }) => {
        const a = new clientAnimation();
        a.init();
        this.animations.set('clients', a);
      }),

      // Awards is NOT deferred behind an IntersectionObserver anymore.
      // The click handlers and hover effects must be registered after the
      // pin spacer exists — which is guaranteed by the 600ms wait above.
      document.querySelector('.list-item') && import('./animations/awardsAnimation.js').then(({ awardsAnimation }) => {
        const a = new awardsAnimation();
        a.init();
        this.animations.set('awards', a);
      }),

      document.querySelector('.scroll-track') && import('./animations/footer.js').then(({ FooterAnimation }) => {
        const a = new FooterAnimation(this.cursor);
        a.init();
        this.animations.set('footer', a);
      }),

    ]);

    this.showPage();
  }

  showPage() {
    document.body.classList.add('loaded');
    setTimeout(() => {
      if (document.querySelector('.hero-span')) animateHeroText();
    }, 500);
  }

  setupHoverEffects() {
    if (!this.cursor) return;
    document.querySelectorAll('.item-container').forEach(item => {
      this.cursor.addHoverEffect(item, 'work-hover');
    });
  }

  saveScrollPosition()    { this.savedScrollPosition = window.pageYOffset; }
  restoreScrollPosition() {
    if (this.savedScrollPosition)
      requestAnimationFrame(() => window.scrollTo(0, this.savedScrollPosition));
  }

  destroy() {
    this.animations.forEach(a => a.cleanup?.());
    this.animations.clear();
  }
}

const animationManager = new AnimationManager();
animationManager.saveScrollPosition();

window.addEventListener('load', () => {
  animationManager.init();
  ScrollTrigger.refresh();
});

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.AnimationManager = animationManager;