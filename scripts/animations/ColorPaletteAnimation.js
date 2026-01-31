import { AnimationBase } from '../core/base.js';

export class ColorPaletteAnimation extends AnimationBase {
  init() {
    this.setupColorAnimations();
  }

  setupColorAnimations() {
    // Animate primary colors (expand from left to right)
    const primaryColors = gsap.utils.toArray('.color-primary');
    
    if (primaryColors.length > 0) {
      primaryColors.forEach((color, index) => {
        const trigger = gsap.fromTo(color,
          {
            scaleX: 0,
            opacity: 0,
            transformOrigin: 'left center'
          },
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.1, // Stagger each color
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.color-group-primary',
              start: 'top 75%',
              toggleActions: 'play none none none',
              markers: true,
              invalidateOnRefresh: true
            }
          }
        );
        
        this.registerTrigger(trigger.scrollTrigger);
      });
    }

    // Animate secondary colors (expand from top to bottom)
    const secondaryColors = gsap.utils.toArray('.color-secondary');
    
    if (secondaryColors.length > 0) {
      secondaryColors.forEach((color, index) => {
        const trigger = gsap.fromTo(color,
          {
            scaleY: 0,
            opacity: 0,
            transformOrigin: 'center top'
          },
          {
            scaleY: 1,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.08, // Stagger each color
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '.color-group-secondary',
              start: 'top 75%',
              toggleActions: 'play none none none',
              markers: false,
              invalidateOnRefresh: true
            }
          }
        );
        
        this.registerTrigger(trigger.scrollTrigger);
      });
    }
  }
}