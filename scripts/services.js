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

    setTimeout(() => this.restoreScrollPosition(), 100);
  }

  async initializeAnimations() {
    prepareHeroText();
    await new Promise(resolve => requestAnimationFrame(resolve));

    // All below-fold modules load in parallel — no serial waterfall
    await Promise.all([

      // Carousel (above fold, load immediately)
      document.querySelector('.carousel-image') && import('./animations/carousel.js').then(({ initCarousel }) => {
        this.animations.set('carousel', initCarousel());
      }),

      // Service stack pinning animation
      document.querySelector('.service-section') && import('./animations/serviceStack.js').then(({ ServiceStackAnimation }) => {
        const a = new ServiceStackAnimation(); a.init();
        this.animations.set('serviceStack', a);
      }),

      // Process section — lazy-import and defer init until section is near viewport
      document.querySelector('.process-section') && import('./animations/processAnimation.js').then(({ processDescription, processCircle }) => {
        const section = document.querySelector('.process-section');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            processDescription();
            processCircle();
            observer.unobserve(section);
          });
        }, { threshold: 0, rootMargin: '0px 0px -100px 0px' });
        observer.observe(section);
      }),

      // Clients
      document.querySelector('.clients-container') && import('./animations/clientAnimation.js').then(({ clientAnimation }) => {
        const a = new clientAnimation(); a.init();
        this.animations.set('clients', a);
      }),

      // Audit
      document.querySelector('.audit-link') && import('./animations/Audits.js').then(({ AuditAnimation }) => {
        const a = new AuditAnimation(this.cursor); a.init();
        this.animations.set('audit', a);
      }),

      // Reviews
      document.querySelector('.review-strip') && import('./animations/reviews.js').then(({ ReviewsAnimation }) => {
        const a = new ReviewsAnimation(); a.init();
        this.animations.set('reviews', a);
      }),

      // Footer
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

  saveScrollPosition()    { this.savedScrollPosition = window.pageYOffset; }
  restoreScrollPosition() {
    if (this.savedScrollPosition) {
      requestAnimationFrame(() => window.scrollTo(0, this.savedScrollPosition));
    }
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