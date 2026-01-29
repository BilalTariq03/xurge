import { initSmoothScrolling } from "./core/scroll.js";
import { initCustomCursor } from "./core/cursor.js";
import { AddSpans, charReveal, prepareHeroText } from "./utils/text-utils.js";
import { animateHeroText } from "./animations/heroText.js";


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

    this.setupHoverEffects();

    setTimeout(() => {
      this.restoreScrollPosition();
    }, 100);
  }

  async initializeAnimations(){
    prepareHeroText();
    if(document.querySelector('.hero-span'))
    {
      animateHeroText();
    }

    if(document.querySelector('.works-grid')){
      const {WorksAnimation} = await import('./animations/Works.js');
      const worksAnim = new WorksAnimation();
      worksAnim.init();
      this.animations.set('works', worksAnim);
    }

    if(document.querySelector('.clients-container')){
      const {clientAnimation} = await import('./animations/clientAnimation.js');
      const clientAnim = new clientAnimation();
      clientAnim.init();
      this.animations.set('clients', clientAnim);
    }

    if (document.querySelector('.scroll-track')) {
      const { FooterAnimation } = await import('./animations/footer.js');
      const footerAnim = new FooterAnimation(this.cursor);
      footerAnim.init();
      this.animations.set('footer', footerAnim);
    }

    if(document.querySelector('.list-item')){
      const {awardsAnimation} = await import ('./animations/awardsAnimation.js')
      const awardsAnim = new awardsAnimation();
      awardsAnim.init();
      this.animations.set('awards', awardsAnim)
    }
  }


  setupHoverEffects() {
    if (!this.cursor) return;

    // Add hover effects to work items
    const workItems = document.querySelectorAll('.item-container');
    if (workItems.length>0) {
      workItems.forEach((item) =>{
        this.cursor.addHoverEffect(item, 'work-hover');
      })   
    }
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
