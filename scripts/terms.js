// ===== scripts/terms.js =====
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

  // ── Wire Lenis into ScrollTrigger so sticky/pin works correctly ───────
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ── Footer ────────────────────────────────────────────────────────────
  if (document.querySelector('.scroll-track')) {
    const footer = new FooterAnimation(cursor);
    footer.init();
  }

  // ── Sidebar pin via ScrollTrigger (works with Lenis) ─────────────────
  const sidebar = document.querySelector('.privacy-sidebar');
  const content = document.querySelector('.privacy-content');

  if (sidebar && content) {
    ScrollTrigger.create({
      trigger: content,
      start: 'top 120px',
      end: 'bottom bottom',
      pin: sidebar,
      pinSpacing: false,
    });
  }

  // ── Sidebar smooth scroll (intercept anchor clicks → Lenis) ──────────
  document.querySelectorAll('.sidebar-nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      lenis.scrollTo(target, {
        offset: -120,
        duration: 1.4,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    });
  });

  // ── Sidebar active-link tracking ──────────────────────────────────────
  const sections = document.querySelectorAll('.policy-section');
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

  sections.forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActive(section.id),
      onEnterBack: () => setActive(section.id),
    });
  });

  function setActive(id) {
    sidebarLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  }

  // ── Section reveal on scroll ──────────────────────────────────────────
  sections.forEach(section => {
    gsap.fromTo(section,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 88%',
          once: true,
        }
      }
    );
  });

  // ── Hero stagger ──────────────────────────────────────────────────────
  gsap.from('.privacy-hero .page-label, .privacy-hero .privacy-title, .privacy-hero .privacy-meta', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.12,
    ease: 'power2.out',
    delay: 0.2,
  });
});