// ===== scripts/insight.js =====
import { initSmoothScrolling } from './core/scroll.js';
import { initCustomCursor } from './core/cursor.js';
import { initPageTransitions } from './core/pageTransition.js';
import { FooterAnimation } from './animations/footer.js';

window.addEventListener('load', () => {
  // ── Components (same as every other page) ─────────────────────────────
  initSmoothScrolling();
  const cursor = initCustomCursor();
  initPageTransitions();

  // ── Footer scroll-track animation ─────────────────────────────────────
  if (document.querySelector('.scroll-track')) {
    const footer = new FooterAnimation(cursor);
    footer.init();
  }

  // ── Your original renderStrip logic, unchanged ─────────────────────────
  function renderStrip() {
    const stripScroller = document.querySelector('.scroll-strip');
    if (!stripScroller) return;

    const content = Array.from(stripScroller.children);
    content.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute('aria-hidden', true);
      stripScroller.appendChild(duplicatedItem);
    });
  }

  renderStrip();
});