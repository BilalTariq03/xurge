// ===== scripts/sitemap.js =====
import { initSmoothScrolling } from './core/scroll.js';
import { initCustomCursor } from './core/cursor.js';
import { initPageTransitions } from './core/pageTransition.js';
import { FooterAnimation } from './animations/footer.js';

window.addEventListener('load', () => {
  // ── Core ──────────────────────────────────────────────────────────────
  const lenis = initSmoothScrolling();
  const cursor = initCustomCursor();
  initPageTransitions();
  gsap.registerPlugin(ScrollTrigger);

  // ── Wire Lenis into ScrollTrigger ─────────────────────────────────────
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ── Footer ────────────────────────────────────────────────────────────
  if (document.querySelector('.scroll-track')) {
    const footer = new FooterAnimation(cursor);
    footer.init();
  }

  // ── Count total links and display ─────────────────────────────────────
  const totalLinks = document.querySelectorAll('.sitemap-link').length;
  const counter = document.getElementById('link-count');
  if (counter) {
    // Animate count up
    gsap.fromTo({ val: 0 }, { val: totalLinks }, {
      duration: 1.2,
      delay: 0.5,
      ease: 'power2.out',
      onUpdate: function () {
        counter.textContent = Math.round(this.targets()[0].val);
      }
    });
  }

  // ── Hero entrance ─────────────────────────────────────────────────────
  gsap.from('.sitemap-hero-left .page-label', {
    opacity: 0, y: 16, duration: 0.5, ease: 'power2.out', delay: 0.1
  });
  gsap.from('.sitemap-title', {
    opacity: 0, y: 30, duration: 0.7, ease: 'power2.out', delay: 0.2
  });
  gsap.from('.sitemap-hero-desc', {
    opacity: 0, y: 20, duration: 0.6, ease: 'power2.out', delay: 0.35
  });
  gsap.from('.sitemap-hero-meta', {
    opacity: 0, y: 12, duration: 0.5, ease: 'power2.out', delay: 0.5
  });

  // ── Section reveals ───────────────────────────────────────────────────
  document.querySelectorAll('.sitemap-section').forEach((section, i) => {
    // Section header slides in from left
    gsap.fromTo(section.querySelector('.sitemap-section-header'),
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 85%', once: true }
      }
    );

    // Links stagger in
    gsap.fromTo(section.querySelectorAll('.sitemap-link'),
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
        stagger: 0.07,
        scrollTrigger: { trigger: section, start: 'top 80%', once: true }
      }
    );

    // Background index number parallax
    const bg = section.querySelector('.sitemap-section-bg');
    if (bg) {
      gsap.to(bg, {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    }
  });

  // ── Link hover cursor effect ──────────────────────────────────────────
  if (cursor) {
    document.querySelectorAll('.sitemap-links').forEach(list => {
      cursor.addHoverEffect(list, 'link-hover');
    });
  }
});