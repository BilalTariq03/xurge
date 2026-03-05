// ===== scripts/projects.js (OPTIMIZED) =====
import { initSmoothScrolling } from './core/scroll.js';
import { initCustomCursor } from './core/cursor.js';
import { AddSpans, charReveal, prepareHeroText } from './utils/text-utils.js';
import { animateHeroText } from "./animations/heroText.js";
import { initPageTransitions } from './core/pageTransition.js';

// ─── Data helpers ────────────────────────────────────────────────────────────

// Cache the fetch so repeated calls on the same page don't re-request
let _projectsCache = null;
async function loadProjectsData() {
  if (_projectsCache) return _projectsCache;
  const response = await fetch('../data/projects.json');
  if (!response.ok) throw new Error('Failed to load projects data');
  _projectsCache = await response.json();
  return _projectsCache;
}

function getSlugFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

// ─── Rendering ───────────────────────────────────────────────────────────────

function renderWorkHero(work) {
  const hero = document.getElementById('work-hero');
  if (!hero) return;

  hero.innerHTML = `
    <div class="work-hero-body">
      <div class="work-hero-title-wrap">
        <h1 class="work-title hero-text">
          <span class="line">${work.title}</span>
        </h1>
        <p class="work-description hero-text">
          <span class="line">${work.shortDescription}</span>
        </p>
      </div>
      <p class="work-hero-scroll">
        SCROLL DOWN
        <span class="work-hero-scroll-arrow" aria-hidden="true">↓</span>
      </p>
    </div>
  `;
}

function buildTextBlockClasses(block) {
  const classes = ['block', 'text-block'];
  if (block.align === 'right') classes.push('align-right');
  else if (block.align === 'left') classes.push('align-left');

  const allowedStyles = new Set(['large-text', 'top-margin', 'bottom-margin']);
  if (Array.isArray(block.style)) {
    block.style.forEach(s => { if (allowedStyles.has(s)) classes.push(s); });
  }
  if (block.class)   classes.push(block.class);
  if (block.animate) classes.push(block.animate);
  return classes.join(' ');
}

/**
 * OPTIMIZATION: Images now get:
 *  - loading="lazy"      → browser skips off-screen images until needed
 *  - decoding="async"    → image decode won't block the main thread
 *
 * Videos now get:
 *  - preload="none"      → stops the browser fetching video data on page load
 */
function renderBlocks(blocks) {
  const container = document.getElementById('work-content');
  if (!container) return;

  // Build all HTML in one pass, then set innerHTML once (avoids repeated reflows)
  const html = blocks.map(block => {
    switch (block.type) {

      case 'video':
      case 'video-content':
        return `
          <section class="block ${block.type === 'video' ? 'video-block' : 'video-section'}">
            <div class="video-container">
              <video
                class="project-video"
                muted loop playsinline
                preload="none"
                ${block.poster ? `poster="../images/${block.poster}"` : ''}
              >
                <source src="../images/${block.src}" type="video/mp4">
              </video>
            </div>
          </section>`;

      case 'image-full':
        return `
          <section class="block image-full">
            <img
              src="../images/${block.src}"
              alt="project image"
              class="img-anim"
              loading="lazy"
              decoding="async"
            >
          </section>`;

      case 'image-grid-2':
        return `
          <section class="block image-grid-2">
            ${block.images.map(img =>
              `<img
                src="../images/${img}"
                alt="project image"
                class="img-anim"
                loading="lazy"
                decoding="async"
              >`
            ).join('')}
          </section>`;

      case 'text':
        return `
          <section class="${buildTextBlockClasses(block)}">
            <h3 class="text-heading">${block.heading}</h3>
            <p class="text-body">${block.text}</p>
          </section>`;

      case 'overview':
        return `
          <section class="block overview">
            <div class="overview-headline-wrapper"><p>OVERVIEW</p></div>
            <div class="overview-content-wrapper">
              <ul>
                <li><h3>Industry:</h3><p>${block.data.industry}</p></li>
                <li><h3>Location:</h3><p>${block.data.location}</p></li>
                <li><h3>Company Size:</h3><p>${block.data.companySize}</p></li>
                <li><h3>Services:</h3><p>${block.data.services.join('<br>')}</p></li>
              </ul>
            </div>
          </section>`;

      case 'typography':
        return `
          <section class="block typography">
            <div class="typography-container">
              <div class="typography-heading"><h3>Typeface</h3></div>
              <div class="case-style-container">
                <img
                  src="../images/${block.font.image}"
                  alt="project image"
                  class="font-image"
                  loading="lazy"
                  decoding="async"
                >
                <div class="case-style-grid">
                  <div class="case-style-item"><h3>Foundry</h3><p>${block.font.foundry}</p></div>
                  <div class="case-style-item"><h3>Style</h3><p>${block.font.style}</p></div>
                  <div class="case-style-item weights">
                    <h3>Weights</h3><p>${block.font.weights.join('</br>')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="color-palette-wrapper">
              <div class="palette-heading"><h3>Color Palette</h3></div>
              <div class="color-palette-body">
                ${Object.entries(block.colors || {}).map(([groupName, colors]) => {
                  if (!Array.isArray(colors) || !colors.length) return '';
                  return `
                    <div class="color-group color-group-${groupName}">
                      <div class="color-palette">
                        ${colors.map((c, i) => `
                          <div class="color color-${groupName} color-anim"
                               data-delay="${i * 0.2}"
                               style="background:${c.hex}">
                            <h3>${c.name}</h3>
                            <ul>
                              <li><p>HEX</p><p>${c.hex}</p></li>
                              <li><p>RGB</p><p>${c.rgb}</p></li>
                              <li><p>CMYK</p><p>${c.cmyk}</p></li>
                            </ul>
                          </div>`).join('')}
                      </div>
                    </div>`;
                }).join('')}
              </div>
            </div>
          </section>`;

      case 'recognitions':
        return `
          <section class="block recognitions reveal-up">
            <h3>Recognitions</h3>
            <ul>${block.items.map(i => `<li>${i}</li>`).join('')}</ul>
          </section>`;

      default:
        return '';
    }
  }).join('');

  // Single DOM write instead of one per block
  container.innerHTML = html;
}

// ─── Page init ───────────────────────────────────────────────────────────────

async function initWorkPage() {
  const slug = getSlugFromURL();
  if (!slug) return;

  const data = await loadProjectsData();
  const work = data.works.find(w => w.slug === slug);

  if (!work) {
    document.getElementById('work-content').innerHTML = '<h2>Work not found</h2>';
    return;
  }

  document.title = `${work.title} | Xurge`;
  renderWorkHero(work);
  renderBlocks(work.content);
}

// ─── Animation manager ───────────────────────────────────────────────────────

class AnimationManager {
  constructor() {
    this.animations = new Map();
    this.cursor = null;
    this.lenis = null;
  }

  async init() {
    this.lenis = initSmoothScrolling();
    this.cursor = initCustomCursor();
    initPageTransitions();

    gsap.registerPlugin(ScrollTrigger);

    await this.initializeAnimations();

    this.setupVisibilityHandling();

    setTimeout(() => this.restoreScrollPosition(), 100);
  }

  async initializeAnimations() {
    prepareHeroText();

    // Run text span setup in parallel — they don't depend on each other
    await Promise.all([
      AddSpans('.work .text-body',          'work-char'),
      AddSpans('.aim .text-body',           'aim-char'),
      AddSpans('.brand-identity .text-heading', 'bi-char'),
    ]);

    // Single rAF yield so the browser can apply the span DOM changes
    await new Promise(resolve => requestAnimationFrame(resolve));

    charReveal('work-char',  'work',           false, 0);
    charReveal('aim-char',   'aim');
    charReveal('bi-char',    'brand-identity');

    // Lazy-load animation modules only when their target elements exist.
    // All imports fire concurrently — no waterfall.
    await Promise.all([
      document.querySelector('.img-anim') && import('./animations/ImageAnimation.js').then(({ ImageAnimation }) => {
        const anim = new ImageAnimation(); anim.init();
        this.animations.set('images', anim);
      }),

      document.querySelector('.project-video') && import('./animations/VideoAnimation.js').then(({ VideoAnimation }) => {
        const anim = new VideoAnimation(); anim.init();
        this.animations.set('videos', anim);
      }),

      document.querySelector('.color-palette-wrapper') && import('./animations/ColorPaletteAnimation.js').then(({ ColorPaletteAnimation }) => {
        const anim = new ColorPaletteAnimation(); anim.init();
        this.animations.set('color-palette', anim);
      }),

      import('./animations/globalReveals.js').then(({ GlobalReveals }) => {
        const anim = new GlobalReveals(); anim.init();
        this.animations.set('global-reveals', anim);
      }),

      document.querySelector('.scroll-track') && import('./animations/footer.js').then(({ FooterAnimation }) => {
        const anim = new FooterAnimation(this.cursor); anim.init();
        this.animations.set('footer', anim);
      }),
    ]);

    this.showPage();
  }

  showPage() {
    document.body.classList.add('loaded');
    if (document.querySelector('.hero-span')) animateHeroText();
  }

  setupVisibilityHandling() {
    document.addEventListener('visibilitychange', () => {
      document.hidden
        ? gsap.globalTimeline.pause()
        : gsap.globalTimeline.resume();
    });
  }

  saveScrollPosition()    { this.savedScrollPosition = window.pageYOffset; }
  restoreScrollPosition() {
    if (this.savedScrollPosition) {
      requestAnimationFrame(() => window.scrollTo(0, this.savedScrollPosition));
    }
  }

  destroy() {
    this.animations.forEach(a => a.cleanup());
    this.animations.clear();
  }
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────

const animationManager = new AnimationManager();
animationManager.saveScrollPosition();

window.addEventListener('load', async () => {
  // 1. Build DOM from JSON + prep animation manager simultaneously
  await initWorkPage();
  await animationManager.init();

  // Debounce refresh so it only runs once even if multiple triggers fire
  requestAnimationFrame(() => ScrollTrigger.refresh());
});

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.AnimationManager = animationManager;