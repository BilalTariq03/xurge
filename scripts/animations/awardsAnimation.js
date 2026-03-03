import { AnimationBase } from "../core/base.js";
import { charReveal, AddSpans } from "../utils/text-utils.js";
import { revealUpOnScroll } from "../utils/reveal-text.js";

export class awardsAnimation extends AnimationBase{

  init(){
    AddSpans('.awards-container .title', 'title-char');
    charReveal('title-char', 'awards-container .title');

    this.textFloatAnimation();
    if (window.innerWidth > 990) {
      this.setupAwardsAnimation(); // hover image + tilt — desktop only
    } else {
      this.setupMobileToggles();   // +/- expand panel — mobile only
    }
  }

  textFloatAnimation(){
    const el = document.querySelector('.awards-container .description');
    if (!el) return;

    const anim = revealUpOnScroll(el);
    this.registerTrigger(anim.scrollTrigger);
  }

  setupAwardsAnimation(){
    const listItems = document.querySelectorAll('.list-item');

    listItems.forEach(item=>{
      const awardImage = item.querySelector('.award-image img')

      item.addEventListener('mousemove', function(e){
        const rect = item.getBoundingClientRect();
        const itemWidth = rect.width;
        const mouseX = e.clientX - rect.left

        const centerX = itemWidth/2;
        const maxRotation =5;
        const maxTranslation = 50;

        const rotation = ((mouseX - centerX)/centerX) * maxRotation
        const translation = ((mouseX - centerX)/centerX) * maxTranslation

        awardImage.style.transform = `rotate(${rotation}deg) translateX(${translation}px)`
      });
      item.addEventListener('mouseleave', function(){
        awardImage.style.transform = 'rotate(0deg) translateX(0px)';
      })
    })
  }

  setupMobileToggles() {
    document.querySelectorAll('.award-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.list-item');
        const isOpen = item.classList.contains('open');

        // Close all open items
        document.querySelectorAll('.list-item.open').forEach(el => {
          el.classList.remove('open');
          el.querySelector('.award-toggle').textContent = '+';
        });

        // Open clicked item if it was closed
        if (!isOpen) {
          item.classList.add('open');
          btn.textContent = '−';
        }
      });
    });
  }

  cleanup() {
    super.cleanup?.();
    // Close any open mobile panels on cleanup
    document.querySelectorAll('.list-item.open').forEach(el => {
      el.classList.remove('open');
      const btn = el.querySelector('.award-toggle');
      if (btn) btn.textContent = '+';
    });
  }
}
