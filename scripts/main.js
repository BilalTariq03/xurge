// ===== js/main.js =====
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
    // Initialize core functionality
    this.lenis = initSmoothScrolling();
    this.cursor = initCustomCursor();


    initPageTransitions();
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Initialize animations based on page content
    await this.initializeAnimations();

    // Handle responsive changes
    this.setupResponsiveHandling();

    // Handle visibility changes for performance
    this.setupVisibilityHandling();

    // Add hover effects to elements
    this.setupHoverEffects();

    // Restore scroll position after animations are set up
    setTimeout(() => {
      this.restoreScrollPosition();
    }, 100);
  }

  async initializeAnimations() {
     // Add text spans to various elements
    AddSpans('.about', 'about-char');
    AddSpans('.booking-heading', 'heading-char');

    if(window.innerWidth > 990) {
      charReveal('about-char', 'about', false, 2000);
    } else {
      charReveal('about-char', 'about', false, 1000)
    }

    const columns = document.querySelectorAll('.logo-column');

    columns.forEach((column, index)=>{
      const logos = column.querySelectorAll('.logo');

      logos.forEach(logo => {
        const clone = logo.cloneNode(true);
        column.append(clone);
      });
    });

    document.querySelectorAll('.work-book').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    });
  });
    
    // Hero animation (if hero exists)
    if (document.querySelector('.animation-section')) {
      // console.log('here')
      const { HeroAnimation } = await import('./animations/HeroAnimation.js');
      const heroAnim = new HeroAnimation();
      heroAnim.init();
      this.animations.set('hero', heroAnim);
    }

    // Stats animation (if stats exist)
    if (document.querySelector('.stats-section')) {
      // console.log('here')
      const { StatsAnimation } = await import('./animations/Stats.js');
      const statsAnim = new StatsAnimation();
      statsAnim.init();
      this.animations.set('stats', statsAnim);
    }

    // Works animation (if works exist)
    if (document.querySelector('.works-section')) {
      const { WorksAnimation } = await import('./animations/Works.js');
      const worksAnim = new WorksAnimation();
      worksAnim.init();
      this.animations.set('works', worksAnim);
    }

    // Services animation (if services exist)
    if (document.querySelector('.services-section')) {
      const { ServicesAnimation } = await import('./animations/services.js');
      const servicesAnim = new ServicesAnimation();
      servicesAnim.init();
      this.animations.set('services', servicesAnim);
    }

    // Booking animation (if booking exists)
    if (document.querySelector('.booking-section')) {
      const { BookingAnimation } = await import('./animations/booking.js');
      const bookingAnim = new BookingAnimation();
      bookingAnim.init();
      this.animations.set('booking', bookingAnim);
    }

    // Audit animation (if audit exists)
    if (document.querySelector('.audit-link')) {
      const { AuditAnimation } = await import('./animations/Audits.js');
      const auditAnim = new AuditAnimation(this.cursor);
      auditAnim.init();
      this.animations.set('audit', auditAnim);
    }

    // Reviews animation (if reviews exist)
    if (document.querySelector('.review-strip')) {
      const { ReviewsAnimation } = await import('./animations/reviews.js');
      const reviewsAnim = new ReviewsAnimation();
      reviewsAnim.init();
      this.animations.set('reviews', reviewsAnim);
    }

    // Footer animation (if footer exists)
    if (document.querySelector('.scroll-track')) {
      const { FooterAnimation } = await import('./animations/footer.js');
      const footerAnim = new FooterAnimation(this.cursor);
      footerAnim.init();
      this.animations.set('footer', footerAnim);
    }

   
  }

  setupResponsiveHandling() {
    this.lastBreakpoint = this.getCurrentBreakpoint();

    this.debouncedResize = this.debounce(() => {
      // Handle Three.js resize if services animation exists
      if (this.animations.has('services')) {
        const servicesAnim = this.animations.get('services');
        if (typeof servicesAnim.handleThreeJSResize === 'function') {
          servicesAnim.handleThreeJSResize();
        }
      }
      
      const currentBreakpoint = this.getCurrentBreakpoint();
      
      if (this.lastBreakpoint !== currentBreakpoint) {
        this.handleBreakpointChange(this.lastBreakpoint, currentBreakpoint);
        this.lastBreakpoint = currentBreakpoint;
      }
      
      ScrollTrigger.refresh();
    }, 250);

    window.addEventListener('resize', this.debouncedResize);
  }

  getCurrentBreakpoint() {
    return window.innerWidth <= 600 ? 'mobile' : 
           window.innerWidth <= 990 ? 'tablet' : 'desktop';
  }

  handleBreakpointChange(oldBreakpoint, newBreakpoint) {
    // Reinitialize responsive animations
    this.animations.forEach((animation, key) => {
      if (typeof animation.handleBreakpointChange === 'function') {
        animation.handleBreakpointChange(oldBreakpoint, newBreakpoint);
      } else {
        // Fallback: cleanup and reinitialize
        animation.cleanup();
        animation.init();
      }
    });
  }

  setupVisibilityHandling() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        gsap.globalTimeline.pause();
      } else {
        gsap.globalTimeline.resume();
      }
    });
  }

  setupHoverEffects() {
    if (!this.cursor) return;

    // Add hover effects to work items
    const workItemList = document.querySelector('.work-item-list');
    if (workItemList) {
      this.cursor.addHoverEffect(workItemList, 'work-hover');
    }

    // Add hover effects to work books
    document.querySelectorAll('.work-book').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        el.style.setProperty('--mx', `${x}px`);
        el.style.setProperty('--my', `${y}px`);
      });
    });
  }

  saveScrollPosition() {
    this.savedScrollPosition = window.pageYOffset;
  }

  restoreScrollPosition() {
    if (this.savedScrollPosition) {
      requestAnimationFrame(() => {
        window.scrollTo(0, this.savedScrollPosition);
      });
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  destroy() {
    this.animations.forEach(animation => animation.cleanup());
    this.animations.clear();
    
    // Remove event listeners
    if (this.debouncedResize) {
      window.removeEventListener('resize', this.debouncedResize);
    }
    
    document.removeEventListener('visibilitychange', this.visibilityHandler);
  }
}

// Initialize when DOM is ready
const animationManager = new AnimationManager();

// Save scroll position before initialization
animationManager.saveScrollPosition();

window.addEventListener('load', () => {
  animationManager.init();
  ScrollTrigger.refresh();
});

// Prevent scroll restoration
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Export for global access if needed
window.AnimationManager = animationManager;