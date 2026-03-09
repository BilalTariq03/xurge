// ===== scripts/privacy.js =====
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
  // Without this, ScrollTrigger uses native scroll position, but Lenis
  // intercepts scroll — causing sticky elements and pins to desync.
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
      trigger: content,          // pin lasts as long as the content column
      start: 'top 120px',        // when content top hits navbar bottom
      end: 'bottom bottom',      // until content bottom hits viewport bottom
      pin: sidebar,
      pinSpacing: false,         // don't push content down
    });
  }

  // ── Sidebar smooth scroll (intercept anchor clicks → Lenis) ──────────
  // Without this, clicking #section-id causes an instant native jump
  // because the browser handles it before Lenis can. We prevent that
  // and hand the target off to lenis.scrollTo() instead.
  document.querySelectorAll('.sidebar-nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      lenis.scrollTo(target, {
        offset: -120,   // clear the fixed navbar (100px) + a little breathing room
        duration: 1.4,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
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