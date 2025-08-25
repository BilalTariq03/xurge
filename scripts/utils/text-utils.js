export function AddSpans(className,spanName){
  const currentText = document.querySelector(`.${className}`);
  const text = currentText.textContent;

  currentText.innerHTML = '';

  [...text].forEach((char) =>{
    const span = document.createElement('span');
    span.textContent = char;
    span.classList.add(spanName);
    currentText.appendChild(span);
  })
}


export function prepareHeroText() {
  // console.log('called')
  const lines = document.querySelectorAll('.hero-text .line');

  lines.forEach(line => {
    // avoid re-processing
    if (line.dataset.processed) return;

    // collect text nodes only (keeps markup like <span class="stone-color">)
    const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(node => {
      const text = node.textContent;
      const fragment = document.createDocumentFragment();

      // split into words and spaces (preserves punctuation attached to word)
      const parts = text.match(/\S+|\s+/g) || [];

      parts.forEach(part => {
        if (/\s+/.test(part)) {
          // keep whitespace as text node
          fragment.appendChild(document.createTextNode(part));
        } else {
          // word -> create a wrapper so the whole word stays together
          const wordEl = document.createElement('span');
          wordEl.className = 'hero-word';

          // split word into letter spans
          [...part].forEach(char => {
            const span = document.createElement('span');
            span.className = 'hero-span';
            span.textContent = char;
            wordEl.appendChild(span);
          });

          fragment.appendChild(wordEl);
        }
      });

      node.replaceWith(fragment);
    });

    // Also process any existing inline elements like .stone-color
    line.querySelectorAll('.stone-color').forEach(el => {
      if (el.dataset.processed) return;
      const txt = el.textContent;
      el.innerHTML = '';

      const parts = txt.match(/\S+|\s+/g) || [];
      parts.forEach(part => {
        if (/\s+/.test(part)) {
          el.appendChild(document.createTextNode(part));
        } else {
          const wordEl = document.createElement('span');
          wordEl.className = 'hero-word';
          [...part].forEach(char => {
            const span = document.createElement('span');
            span.className = 'hero-span';
            span.textContent = char;
            wordEl.appendChild(span);
          });
          el.appendChild(wordEl);
        }
      });

      el.dataset.processed = '1';
    });

    line.dataset.processed = '1';
  });
}


export function charReveal(className, triggerName, markers = false, pinOffset = 0) {
  gsap.to(`.${className}`, {
    opacity: 1,
    stagger: {
      each: 0.3,
      from: 'start',
      ease: 'power1.inout'
    },
    scrollTrigger: {
      trigger: `.${triggerName}`,
      start: `top+=${pinOffset} 80%`,
      end: `bottom+=${pinOffset} 65%`,
      scrub: true,
      markers,
      invalidateOnRefresh: true // Mark for cleanup on resize
    }
  });
}