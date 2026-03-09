
import { initCustomCursor } from './core/cursor.js';
import { initPageTransitions } from './core/pageTransition.js';

class FAQPageManager {
  constructor() {
    this.cursor = null;
    this.footerObserver = null;
    this.faqAccordion = null;
  }

  async init() {
    this.cursor = initCustomCursor();
    initPageTransitions();

    this.initFooterAnimation();
    this.initAccordion();
  }

  // ─────────────────────────────────────────
  // Footer animation (lazy loaded)
  // ─────────────────────────────────────────

  initFooterAnimation() {
    const scrollTrack = document.querySelector('.scroll-track');
    if (!scrollTrack) return;

    this.footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        import('./animations/footer.js').then(({ FooterAnimation }) => {
          const footerAnim = new FooterAnimation(this.cursor);
          footerAnim.init();
        });

        this.footerObserver.unobserve(scrollTrack);
      });

    }, {
      threshold: 0,
      rootMargin: '0px 0px -100px 0px'
    });

    this.footerObserver.observe(scrollTrack);
  }

  // ─────────────────────────────────────────
  // FAQ Accordion
  // ─────────────────────────────────────────

  initAccordion() {
    const listEl = document.getElementById('faq-list');
    if (!listEl) return;

    this.faqAccordion = new FaqAccordion(listEl);

    // Optional: expose globally
    window.faqAccordion = this.faqAccordion;
  }
}


// =============================================================================
// FAQ Accordion Class
// =============================================================================

class FaqAccordion {

  constructor(listEl) {
    this.listEl = listEl;
    this.items = Array.from(listEl.querySelectorAll('.faq-item'));
    this.bindEvents();
  }

  bindEvents() {
    this.items.forEach(item => {

      const btn = item.querySelector('.faq-question');
      if (!btn) return;

      btn.addEventListener('click', () => this.toggle(item));

      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle(item);
        }
      });

    });
  }

  toggle(targetItem) {
    const isOpen = targetItem.classList.contains('is-open');

    this.closeAll();

    if (!isOpen) {
      this.open(targetItem);
    }
  }

  open(item) {
    item.classList.add('is-open');
    item.querySelector('.faq-question')
        .setAttribute('aria-expanded', 'true');
  }

  close(item) {
    item.classList.remove('is-open');
    item.querySelector('.faq-question')
        .setAttribute('aria-expanded', 'false');
  }

  closeAll() {
    this.items.forEach(item => this.close(item));
  }

  openByIndex(index) {
    if (!this.items[index]) return;

    this.closeAll();
    this.open(this.items[index]);
  }
}


// =============================================================================
// Boot
// =============================================================================

const faqPage = new FAQPageManager();

window.addEventListener('load', () => {
  faqPage.init();
});