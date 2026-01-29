// ===== js/main.js =====
import { initSmoothScrolling } from './core/scroll.js';
import { initCustomCursor } from './core/cursor.js';
import { AddSpans, charReveal, prepareHeroText } from './utils/text-utils.js';

//Data helpers
async function loadProjectsData() {
  const response = await fetch('../data/projects.json');
  if (!response.ok) {
    throw new Error('Failed to load projects data');
  }
  return response.json();
}

function getSlugFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}


function renderWorkHero(work) {
  const hero = document.getElementById('work-hero');
  if (!hero) return;

  hero.innerHTML = `
    <h1 class="work-title">${work.title}</h1>
    <p class="work-description">${work.shortDescription}</p>
  `;
}

function buildTextBlockClasses(block) {
  const classes = ['block', 'text-block'];

  if (block.align === 'right') classes.push('align-right');
  else if(block.align === 'left') classes.push('align-left')

  const styleMap = {
    'large-text': 'large-text',
    'top-margin': 'top-margin',
    'bottom-margin': 'bottom-margin'
  };

  if (Array.isArray(block.style)) {
  block.style.forEach(style => {
    if (styleMap[style]) classes.push(styleMap[style]);
  });
}


  return classes.join(' ');
}


function renderBlocks(blocks) {
  const container = document.getElementById('work-content');
  if (!container) return;

  container.innerHTML = '';

  blocks.forEach(block => {
    switch (block.type) {

      case 'vid-full':
        container.innerHTML += `
          <section class="block vid-full">
            <video autoplay loop class="vid">
              <source src="../images/${block.src}" type="video/mp4">
            </video>
          </section>`;
        break;

      case 'image-full':
        container.innerHTML += `
          <section class="block image-full">
            <img src="../images/${block.src}" alt="project image">
          </section>`;
        break;

      case 'image-grid-2':
        container.innerHTML += `
          <section class="block image-grid-2">
            ${block.images.map(img =>
              `<img src="./images/${img}" alt="project image">`
            ).join('')}
          </section>`;
        break;

      case 'text':
        container.innerHTML += `
          <section class="${buildTextBlockClasses(block)}  ${block.class || ''}">
            <h3 class="text-heading">
            ${block.heading}
            </h3>

            <p class="text-body">
              ${block.text}
            </p>
          </section>
        `;
        break;

      case 'overview':
        container.innerHTML += `
          <section class="block overview">
            <div class="overview-headline-wrapper">
              <p>OVERVIEW</p>
            </div>
            <div class="overview-content-wrapper">
              <ul>
                <li>
                  <h3>Industry:</h3> 
                  <p>${block.data.industry}</p>
                </li>
                <li>
                  <h3>Location:</h3> 
                  <p>${block.data.location}</p>
                </li>
                <li>
                  <h3>Company Size:</h3> 
                  <p>${block.data.companySize}</p>
                </li>
                <li>
                  <h3>Services:</h3>
                  <p>${block.data.services.join('<br>')}</p>
                </li>
              </ul>
            </div>
          </section>`;
        break;


      case 'typography':
        container.innerHTML += `
          <section class="block typography">
            <div class="typography-container">
              <div class="typography-heading">
                <h3>Typeface</h3>
              </div>

              <div class="case-style-container">
                <img src="../images/${block.font.image}" alt="project image" class="font-image">
                  <div class="case-style-grid">
                    <div class="case-style-item">
                      <h3>Foundry</h3>
                      <p>${block.font.foundry}</p>
                    </div>
                    <div class="case-style-item">
                      <h3>Style</h3>
                      <p>${block.font.style}</p>
                    </div>
                    <div class="case-style-item weights">
                      <h3>Weights</h3>
                      <p>${block.font.weights.join('</br>')}</p>
                    </div>
                  </div>
              </div>
            </div>
            
            <div class="color-palette-wrapper">
              <div class="palette-heading">
                <h3>Color Palette</h3>
              </div>
              
              <div class="color-palette-body">
                ${Object.entries(block.colors || {}).map(([groupName, colors]) => {
                  if (!Array.isArray(colors) || !colors.length) return '';

                  return `
                    <div class="color-group color-group-${groupName}">
                      <div class="color-palette">
                        ${colors.map(c => `
                          <div class="color color-${groupName}" style="background:${c.hex}">
                            <h3>${c.name}</h3>
                            <ul>
                              <li>
                                <p>HEX</p>
                                <p>${c.hex}</p>
                              </li>

                              <li>
                                <p>RGB</p>
                                <p>${c.rgb}</p>
                              </li>
                              
                              <li>
                                <p>CMYK</p>
                                <p>${c.cmyk}</p>
                              </li>
                            </ul>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </section>`;
        break;

      case 'recognitions':
        container.innerHTML += `
          <section class="block recognitions">
            <h3>Recognitions</h3>
            <ul>
              ${block.items.map(i => `<li>${i}</li>`).join('')}
            </ul>
          </section>`;
        break;
    }
  });
}

async function initWorkPage() {
  const slug = getSlugFromURL();
  if (!slug) return;

  const data = await loadProjectsData();
  const work = data.works.find(w => w.slug === slug);

  if (!work) {
    document.getElementById('work-content').innerHTML = '<h2>Work not found</h2>';
    return;
  }

  renderWorkHero(work);
  renderBlocks(work.content);
}



class AnimationManager {
  constructor() {
    this.animations = new Map();
    this.cursor = null;
    this.lenis = null;
    this.lastBreakpoint = null;
    this.debouncedResize = null;
  }

  async init() {
    // Initialize core functionality
    this.lenis = initSmoothScrolling();
    this.cursor = initCustomCursor();

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Initialize animations based on page content
    await this.initializeAnimations();


    // Handle visibility changes for performance
    this.setupVisibilityHandling();


    // Restore scroll position after animations are set up
    setTimeout(() => {
      this.restoreScrollPosition();
    }, 100);
  }

  async initializeAnimations() {
    

   
  }


  handleBreakpointChange(oldBreakpoint, newBreakpoint) {
    // Reinitialize responsive animations
    this.animations.forEach((animation, key) => {
      if (typeof animation.handleBreakpointChange === 'function') {
        animation.handleBreakpointChange(oldBreakpoint, newBreakpoint);
      } else {
        // Fallback: cleanup and reinitialize
        animation.cleanup();
        animation.init();
      }
    });
  }

  setupVisibilityHandling() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        gsap.globalTimeline.pause();
      } else {
        gsap.globalTimeline.resume();
      }
    });
  }


  saveScrollPosition() {
    this.savedScrollPosition = window.pageYOffset;
  }

  restoreScrollPosition() {
    if (this.savedScrollPosition) {
      requestAnimationFrame(() => {
        window.scrollTo(0, this.savedScrollPosition);
      });
    }
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  destroy() {
    this.animations.forEach(animation => animation.cleanup());
    this.animations.clear();
    
    // Remove event listeners
    if (this.debouncedResize) {
      window.removeEventListener('resize', this.debouncedResize);
    }
    
    document.removeEventListener('visibilitychange', this.visibilityHandler);
  }
}

// Initialize when DOM is ready
const animationManager = new AnimationManager();

// Save scroll position before initialization
animationManager.saveScrollPosition();

window.addEventListener('load', async () => {
  await initWorkPage();        // 1️⃣ build DOM from JSON
  animationManager.init();     // 2️⃣ init animations
  ScrollTrigger.refresh();     // 3️⃣ fix scroll positions
});


// Prevent scroll restoration
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Export for global access if needed
window.AnimationManager = animationManager;