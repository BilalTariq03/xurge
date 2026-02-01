import { initSmoothScrolling } from "./core/scroll.js";
import { initCustomCursor } from "./core/cursor.js";
import { prepareHeroText } from "./utils/text-utils.js";
import { animateHeroText } from "./animations/heroText.js";
import { initPageTransitions } from "./core/pageTransition.js";
import { initCarousel } from "./animations/carousel.js";
import {processDescription, processCircle} from './animations/processAnimation.js';



class AnimationManager{
  constructor(){
    this.animations = new Map();
    this.cursor = null;
    this.lenis = null;
  }

  async init(){
    this.lenis = initSmoothScrolling();
    this.cursor = initCustomCursor();

    gsap.registerPlugin(ScrollTrigger);

    await this.initializeAnimations();

    initPageTransitions();

    processDescription();
    processCircle();

    setTimeout(() => {
      this.restoreScrollPosition();
    }, 100);
  }

  async initializeAnimations(){
    prepareHeroText();

    await new Promise(resolve => requestAnimationFrame(resolve));

    if (document.querySelector('.carousel-image')) {
      const carousel = initCarousel();
      this.animations.set('carousel', carousel);
    }

    // Service stack animation
    if (document.querySelector('.service-section')) {
      const { ServiceStackAnimation } = await import('./animations/serviceStack.js');
      const serviceStack = new ServiceStackAnimation();
      serviceStack.init();
      this.animations.set('serviceStack', serviceStack);
    }

    if(document.querySelector('.clients-container')){
      const {clientAnimation} = await import('./animations/clientAnimation.js');
      const clientAnim = new clientAnimation();
      clientAnim.init();
      this.animations.set('clients', clientAnim);
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

    
    if (document.querySelector('.scroll-track')) {
      const { FooterAnimation } = await import('./animations/footer.js');
      const footerAnim = new FooterAnimation(this.cursor);
      footerAnim.init();
      this.animations.set('footer', footerAnim);
    }

   

    this.showPage();
  }

  showPage() {
    document.body.classList.add('loaded');
    
    setTimeout(() => {
      if(document.querySelector('.hero-span')) {
        animateHeroText();
      }
    }, 500);
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

const animationManager = new AnimationManager();

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