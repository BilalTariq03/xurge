export function initPageTransitions() {
  const transitionEl = document.getElementById('page-transition');
  if (!transitionEl) return;

  let isTransitioning = false;

  // === NORMAL LINKS ===
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', e => {
      const target = link.getAttribute('href');

      if (
        isTransitioning ||
        !target ||
        target.startsWith('#') ||
        target.startsWith('mailto:') ||
        target.startsWith('tel:') ||
        link.target === '_blank' ||
        (target.startsWith('http') && !target.startsWith(window.location.origin))
      ) {
        return;
      }

      e.preventDefault();
      isTransitioning = true;

      transitionEl.classList.add('active');

      setTimeout(() => {
        window.location.href = target;
      }, 600);
    });
  });

  // === BACK BUTTON ===
  const backBtn = document.getElementById('btn-back');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (isTransitioning) return;

      isTransitioning = true;
      transitionEl.classList.add('active');

      setTimeout(() => {
        history.back();
      }, 600);
    });
  }


    // Reset overlay if browser restores page from bfcache (back/forward button)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      const overlay = document.getElementById('page-transition');
      if (overlay) {
        overlay.classList.remove('active');
        // Force immediate reset, no animation
        overlay.style.transition = 'none';
        overlay.style.bottom = '-100%';
        // Re-enable transition after reset
        requestAnimationFrame(() => {
          overlay.style.transition = '';
        });
      }
    }
  });
}