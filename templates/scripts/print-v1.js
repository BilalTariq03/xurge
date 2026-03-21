// scripts/insight.js
import { initSmoothScrolling }  from '../../scripts/core/scroll.js';
import { initCustomCursor }     from '../../scripts/core/cursor.js';
import { initPageTransitions }  from '../../scripts/core/pageTransition.js';
import { FooterAnimation }      from '../../scripts/animations/footer.js';
import { ImageAnimation }       from '../../scripts/animations/imageAnimation.js';

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
});