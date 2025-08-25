import { AnimationBase } from '../core/base.js';

export class AuditAnimation extends AnimationBase {
  constructor(cursor) {
    super();
    this.cursor = cursor;
  }

  init() {
    this.setupAuditHoverEffects();
  }

  setupAuditHoverEffects() {
    const img = document.querySelector('.circles-image');
    const auditLink = document.querySelector('.audit-link');

    if (!img || !auditLink) return;

    // Add hover effect to cursor
    if (this.cursor) {
      this.cursor.addHoverEffect(auditLink, 'work-hover');
    }

    // Image movement on mouse move
    auditLink.addEventListener("mousemove", (e) => {
      const rect = auditLink.getBoundingClientRect();
      
      const relativeX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const relativeY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      
      const maxMoveX = rect.width * 0.5;
      const maxMoveY = rect.height * 0.3;
      
      const moveX = relativeX * maxMoveX;
      const moveY = relativeY * maxMoveY;

      gsap.to(img, {
        x: moveX,
        y: moveY,
        duration: 0.2,
        ease: "power2.out"
      });
    });

    // Reset image position on mouse leave
    auditLink.addEventListener("mouseleave", () => {
      gsap.to(img, {
        x: 0,
        y: 0,
        duration: 0.2,
        ease: "power2.out"
      });
    });

    auditLink.addEventListener('mouseenter', ()=>{
      document.querySelector('.cursor-ball')?.classList.add('work-hover')
    })

    auditLink.addEventListener('mouseleave', ()=>{
      document.querySelector('.cursor-ball')?.classList.remove('work-hover')
    })
  }
}