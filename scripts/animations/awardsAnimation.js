import { AnimationBase } from "../core/base.js";
import { charReveal, AddSpans } from "../utils/text-utils.js";
import { revealUpOnScroll } from "../utils/reveal-text.js";

export class awardsAnimation extends AnimationBase {
  init() {
    AddSpans('.awards-container .title', 'title-char');
    charReveal('title-char', 'awards-container .title');

    this.textFloatAnimation();
    this.setupToggles();          // runs on ALL screen sizes
    this.setupDesktopHover();     // tilt image — desktop only, no harm if it runs elsewhere
  }

  textFloatAnimation() {
    const el = document.querySelector('.awards-container .description');
    if (!el) return;

    // revealUpOnScroll now returns { observer } not { scrollTrigger }
    const { observer } = revealUpOnScroll(el);
    if (observer) {
      this._observers = this._observers || [];
      this._observers.push(observer);
    }
  }

  setupToggles() {
    document.querySelectorAll('.award-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.list-item');
        if (!item) return;

        const isOpen = item.classList.contains('open');

        // Close all open items first
        document.querySelectorAll('.list-item.open').forEach(el => {
          el.classList.remove('open');
          const b = el.querySelector('.award-toggle');
          if (b) b.textContent = '+';
        });

        // Toggle the clicked one open if it was closed
        if (!isOpen) {
          item.classList.add('open');
          btn.textContent = '−';
        }
      });
    });
  }

  setupDesktopHover() {
    document.querySelectorAll('.list-item').forEach(item => {
      const awardImage = item.querySelector('.award-image img');
      if (!awardImage) return;

      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const centerX = rect.width / 2;
        const mouseX = e.clientX - rect.left;
        const rotation = ((mouseX - centerX) / centerX) * 5;
        const translation = ((mouseX - centerX) / centerX) * 50;
        awardImage.style.transform = `rotate(${rotation}deg) translateX(${translation}px)`;
      });

      item.addEventListener('mouseleave', () => {
        awardImage.style.transform = 'rotate(0deg) translateX(0px)';
      });
    });
  }

  cleanup() {
    (this._observers || []).forEach(o => o.disconnect());
    this._observers = [];

    document.querySelectorAll('.list-item.open').forEach(el => {
      el.classList.remove('open');
      const btn = el.querySelector('.award-toggle');
      if (btn) btn.textContent = '+';
    });

    super.cleanup();
  }
}