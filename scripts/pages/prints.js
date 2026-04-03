// scripts/print-v5.js

// ── Poster data ──────────────────────────────────────────────────────────────
// Add/remove entries here. category must match a filter-btn data-filter value:
// "poster" | "card" | "flyer" | "brand"
const POSTERS = [
  { src: './images/Posters/31.avif',  name: 'Poster 31',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/30.avif',  name: 'Poster 30',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/29.avif',  name: 'Poster 29',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/28.avif',  name: 'Poster 28',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/27.avif',  name: 'Poster 27',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/26.avif',  name: 'Poster 26',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/25.avif',  name: 'Poster 25',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/24.avif',  name: 'Poster 24',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/23.avif',  name: 'Poster 23',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/22.avif',  name: 'Poster 22',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/21.avif',  name: 'Poster 21',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/20.avif',  name: 'Poster 20',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/19.avif',  name: 'Poster 19',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/18.avif',  name: 'Poster 18',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/17.avif',  name: 'Poster 17',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/16.avif',  name: 'Poster 16',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/15.avif',  name: 'Poster 15',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/14.avif',  name: 'Poster 14',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/13.avif',  name: 'Poster 13',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/12.avif',  name: 'Poster 12',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/11.avif',  name: 'Poster 11',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/10.avif',  name: 'Poster 10',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/9.avif',  name: 'Poster 9',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/8.avif',  name: 'Poster 8',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/7.avif',  name: 'Poster 7',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/6.avif',  name: 'Poster 6',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/5.avif',  name: 'Poster 5',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/4.avif',  name: 'Poster 4',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/3.avif',  name: 'Poster 3',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/2.avif',  name: 'Poster 2',  type: 'Poster', category: 'poster', desc: '' },
  { src: './images/Posters/1.avif',  name: 'Poster 1',  type: 'Poster', category: 'poster', desc: '' },
];

function renderPosters() {
  const grid = document.getElementById('posters-grid');
  if (!grid) return;

  grid.innerHTML = POSTERS.map(p => `
    <article class="poster-card img-anim" data-category="${p.category}"
      data-src="${p.src}" data-name="${p.name}" data-type="${p.type}">
      <div class="poster-card__media">
        <img src="${p.src}" alt="${p.name}" loading="lazy" decoding="async">
        <div class="poster-card__overlay">
          <span class="poster-card__type">${p.type}</span>
          <h2 class="poster-card__name">${p.name}</h2>
          <p class="poster-card__desc">${p.desc}</p>
        </div>
      </div>
    </article>
  `).join('');
}
// ─────────────────────────────────────────────────────────────────────────────

import { initSmoothScrolling }           from '../core/scroll.js';
import { initCustomCursor }              from '../core/cursor.js';
import { initPageTransitions }           from '../core/pageTransition.js';
import { FooterAnimation }               from '../animations/footer.js';
import { ImageAnimation }                from '../animations/ImageAnimation.js';
import { animateHeroText } from '../animations/heroText.js';
import { prepareHeroText, prepareSubText, animateSubText } from '../utils/text-utils.js'

window.addEventListener('load', () => {
  initSmoothScrolling();
  const cursor = initCustomCursor();
  initPageTransitions();

  renderPosters();

  prepareHeroText();
  prepareSubText('.posters-header__sub');
  animateHeroText();
  animateSubText();

  if (document.querySelector('.scroll-track')) {
    const footer = new FooterAnimation(cursor);
    footer.init();
  }

  if (document.querySelector('.img-anim')) {
    const imageAnim = new ImageAnimation(cursor);
    imageAnim.init();
  }

  initLightbox();
});

function initLightbox() {
  const lightbox   = document.getElementById('lightbox');
  const backdrop   = document.getElementById('lightbox-backdrop');
  const closeBtn   = document.getElementById('lightbox-close');
  const img        = document.getElementById('lightbox-img');
  const nameEl     = document.getElementById('lightbox-name');
  const typeEl     = document.getElementById('lightbox-type');

  function open(card) {
    img.src      = card.dataset.src;
    img.alt      = card.dataset.name;
    nameEl.textContent = card.dataset.name;
    typeEl.textContent = card.dataset.type;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    // Clear src after transition so old image doesn't flash on next open
    setTimeout(() => { img.src = ''; }, 400);
  }

  // Open on card click
  document.querySelectorAll('.poster-card').forEach(card => {
    card.addEventListener('click', () => open(card));
  });

  // Close on backdrop or close button
  backdrop.addEventListener('click', close);
  closeBtn.addEventListener('click', close);

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) close();
  });
}
