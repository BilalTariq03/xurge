// ===== scripts/main.js (OPTIMIZED) =====
import { initSmoothScrolling } from './core/scroll.js';
import { initCustomCursor } from './core/cursor.js';
import { AddSpans, charReveal, prepareHeroText } from './utils/text-utils.js';
import { initPageTransitions } from './core/pageTransition.js';

class AnimationManager {
  constructor() {
    this.animations = new Map();
    this.cursor = null;
    this.lenis = null;
    this.lastBreakpoint = null;
    this.debouncedResize = null;
  }

  async init() {
    this.lenis = initSmoothScrolling();
    this.cursor = initCustomCursor();
    initPageTransitions();
    gsap.registerPlugin(ScrollTrigger);

    await this.initializeAnimations();

    this.setupResponsiveHandling();
    this.setupVisibilityHandling();
    this.setupHoverEffects();

    setTimeout(() => this.restoreScrollPosition(), 100);
  }

  async initializeAnimations() {
    // ── Above-fold: runs before anything is shown ─────────────────────────
    prepareHeroText();

    // Clone logo columns for the infinite scroll strip
    document.querySelectorAll('.logo-column').forEach(column => {
      column.querySelectorAll('.logo').forEach(logo => column.append(logo.cloneNode(true)));
    });

    // Both AddSpans have no dependency on each other — run in parallel
    await Promise.all([
      AddSpans('.about', 'about-char'),
      AddSpans('.booking-heading', 'heading-char'),
    ]);

    // charReveal uses deferred ScrollTrigger (registers only when element is near viewport)
    charReveal('about-char', 'about', false, 0);
    charReveal('heading-char', 'booking-heading', false, 0);

    // One rAF yield so the browser applies span DOM changes before any measurement
    await new Promise(resolve => requestAnimationFrame(resolve));

    // ── Hero: above fold, load immediately ────────────────────────────────
    if (document.querySelector('.animation-section')) {
      const { HeroAnimation } = await import('./animations/HeroAnimation.js');
      const a = new HeroAnimation(); a.init();
      this.animations.set('hero', a);
    }

    // ── Everything below fold: all imports fire concurrently ──────────────
    await Promise.all([

      // Stats counter animation
      document.querySelector('.stats-section') && import('./animations/Stats.js').then(({ StatsAnimation }) => {
        const a = new StatsAnimation(); a.init();
        this.animations.set('stats', a);
      }),

      // Works horizontal scroll
      document.querySelector('.works-section') && import('./animations/Works.js').then(({ WorksAnimation }) => {
        const a = new WorksAnimation(); a.init();
        this.animations.set('works', a);
      }),

      // Services Three.js canvas — already defers Three.js init until scroll enters
      document.querySelector('.services-section') && import('./animations/services.js').then(({ ServicesAnimation }) => {
        const a = new ServicesAnimation(); a.init();
        this.animations.set('services', a);
      }),

      // Booking — defer full init until the section is near viewport
      document.querySelector('.booking-section') && import('./animations/booking.js').then(({ BookingAnimation }) => {
        const section = document.querySelector('.booking-section');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const a = new BookingAnimation(); a.init();
            this.animations.set('booking', a);
            observer.unobserve(section);
          });
        }, { threshold: 0, rootMargin: '0px 0px -100px 0px' });
        observer.observe(section);
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
  }

  setupResponsiveHandling() {
    this.lastBreakpoint = this.getCurrentBreakpoint();

    this.debouncedResize = this.debounce(() => {
      if (this.animations.has('services')) {
        const s = this.animations.get('services');
        if (typeof s.handleThreeJSResize === 'function') s.handleThreeJSResize();
      }
      const current = this.getCurrentBreakpoint();
      if (this.lastBreakpoint !== current) {
        this.handleBreakpointChange(this.lastBreakpoint, current);
        this.lastBreakpoint = current;
      }
      ScrollTrigger.refresh();
    }, 250);

    window.addEventListener('resize', this.debouncedResize);
  }

  getCurrentBreakpoint() {
    return window.innerWidth <= 600 ? 'mobile'
         : window.innerWidth <= 990 ? 'tablet'
         : 'desktop';
  }

  handleBreakpointChange(oldBp, newBp) {
    this.animations.forEach(anim => {
      typeof anim.handleBreakpointChange === 'function'
        ? anim.handleBreakpointChange(oldBp, newBp)
        : (anim.cleanup(), anim.init());
    });
  }

  setupVisibilityHandling() {
    document.addEventListener('visibilitychange', () => {
      document.hidden ? gsap.globalTimeline.pause() : gsap.globalTimeline.resume();
    });
  }

  setupHoverEffects() {
    if (!this.cursor) return;
    const workItemList = document.querySelector('.work-item-list');
    if (workItemList) this.cursor.addHoverEffect(workItemList, 'work-hover');

    // Set up work-book mousemove only here (removed duplicate in initializeAnimations)
    document.querySelectorAll('.work-book').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    });
  }

  saveScrollPosition()    { this.savedScrollPosition = window.pageYOffset; }
  restoreScrollPosition() {
    if (this.savedScrollPosition)
      requestAnimationFrame(() => window.scrollTo(0, this.savedScrollPosition));
  }

  debounce(func, wait) {
    let timeout;
    return (...args) => { clearTimeout(timeout); timeout = setTimeout(() => func(...args), wait); };
  }

  destroy() {
    this.animations.forEach(a => a.cleanup?.());
    this.animations.clear();
    if (this.debouncedResize) window.removeEventListener('resize', this.debouncedResize);
  }
}

const animationManager = new AnimationManager();
animationManager.saveScrollPosition();

window.addEventListener('load', () => {
  animationManager.init().then(() => {
    // double refresh after full load — catches any late layout shifts
    requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
  });
});

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.AnimationManager = animationManager;