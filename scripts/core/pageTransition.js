export function initPageTransitions() {
  const transitionEl = document.getElementById('page-transition');
  if (!transitionEl) return;

  let isTransitioning = false;

  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', e => {
      const target = link.getAttribute('href');

      // ignore bad / special links
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
      }, 600); // must match CSS
    });
  });
}
