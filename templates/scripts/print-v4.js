// scripts/print-v5.js
import { initSmoothScrolling }  from '../../scripts/core/scroll.js';
import { initCustomCursor }     from '../../scripts/core/cursor.js';
import { initPageTransitions }  from '../../scripts/core/pageTransition.js';
import { FooterAnimation }      from '../../scripts/animations/footer.js';
import { ImageAnimation }       from '../../scripts/animations/ImageAnimation.js';

window.addEventListener('load', () => {
  initSmoothScrolling();
  const cursor = initCustomCursor();
  initPageTransitions();

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
