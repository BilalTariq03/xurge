// ===== js/animations/footer.js =====
import { AnimationBase } from '../core/base.js';

export class FooterAnimation extends AnimationBase {
  constructor(cursor) {
    super();
    this.cursor = cursor;
    this.animation = null;
    this.lastScrollY = window.scrollY;
  }

  init() {
    this.setupFooterAnimations();
  }

  setupFooterAnimations() {
    const track = document.querySelector('.scroll-track');
    const inqLink = document.querySelector('.footer-title-wrapper');

    if (!track || !inqLink) return;

    // Add hover effect to inquiry link
    if (this.cursor) {
      this.cursor.addHoverEffect(inqLink, 'work-hover');
    }

    // Setup track animation
    this.animation = track.animate(
      [
        { transform: 'translateX(0%)' },
        { transform: 'translateX(-50.3%)' }
      ],
      {
        duration: 15000,
        iterations: Infinity,
        easing: 'linear'
      }
    );

    // Track scroll direction to change animation direction
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      this.animation.playbackRate = (currentScrollY > this.lastScrollY) ? 1 : -1;
      this.lastScrollY = currentScrollY;
    });
  }

  cleanup() {
    super.cleanup();
    
    // Stop animation
    if (this.animation) {
      this.animation.cancel();
    }
    
    // Remove scroll event listener
    window.removeEventListener('scroll', this.scrollHandler);
  }
}