import { initSmoothScrolling } from './core/scroll.js';
import { initCustomCursor } from './core/cursor.js';
import { AddSpans, charReveal, prepareHeroText } from './utils/text-utils.js';
import { animateHeroText } from './animations/heroText.js';
import { initPageTransitions } from './core/pageTransition.js';

class AnimationManager {
  constructor() {
    this.animations = new Map();
    this.cursor = null;
    this.lenis = null;
  }

  async init() {
    this.lenis = initSmoothScrolling();
    this.cursor = initCustomCursor();
    initPageTransitions();
    gsap.registerPlugin(ScrollTrigger);

    await this.initializeAnimations();
  }

  async initializeAnimations() {
    prepareHeroText();

    // AddSpans for both paragraphs in parallel — different selectors, no dependency
    await Promise.all([
      AddSpans('.about-1', 'about-char-1'),
      AddSpans('.about-2', 'about-char-2'),
    ]);

    // Each charReveal needs its own unique char class and container selector
    charReveal('about-char-1', 'about-1', false, 0);
    charReveal('about-char-2', 'about-2', false, 0);

    await new Promise(resolve => requestAnimationFrame(resolve));

    // ── Step 1: serviceStack first (it sets up a pin) ─────────────────────
    if (document.querySelector('.service-section')) {
      const { ServiceStackAnimation } = await import('./animations/serviceStack.js');
      const a = new ServiceStackAnimation(); a.init();
      this.animations.set('serviceStack', a);
    }

    // ── Step 2: wait for serviceStack's internal ScrollTrigger.refresh ────
    await new Promise(resolve => setTimeout(resolve, 600));
    await new Promise(resolve => requestAnimationFrame(resolve));

    // ── Step 3: everything else in parallel, after pin spacer is settled ──
    await Promise.all([

      document.querySelector('.img-anim') && import('./animations/ImageAnimation.js').then(({ ImageAnimation }) => {
        const a = new ImageAnimation(); a.init();
        this.animations.set('images', a);
      }),

      document.querySelector('.stats-section') && import('./animations/Stats.js').then(({ StatsAnimation }) => {
        const a = new StatsAnimation(); a.init();
        this.animations.set('stats', a);
      }),

      document.querySelector('.review-strip') && import('./animations/reviews.js').then(({ ReviewsAnimation }) => {
        const a = new ReviewsAnimation(); a.init();
        this.animations.set('reviews', a);
      }),

      document.querySelector('.list-item') && import('./animations/awardsAnimation.js').then(({ awardsAnimation }) => {
        const a = new awardsAnimation(); a.init();
        this.animations.set('awards', a);
      }),

      document.querySelector('.scroll-track') && import('./animations/footer.js').then(({ FooterAnimation }) => {
        const a = new FooterAnimation(this.cursor); a.init();
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

  destroy() {
    this.animations.forEach(a => a.cleanup?.());
    this.animations.clear();
  }
}

const animationManager = new AnimationManager();

window.addEventListener('load', () => {
  animationManager.init();
  ScrollTrigger.refresh();
});

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.AnimationManager = animationManager;