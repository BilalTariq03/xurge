export function AddSpans(selector, spanName) {
  return new Promise((resolve) => {
    const element = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector;
    
    if (!element) {
      console.warn(`Element not found: ${selector}`);
      resolve();
      return;
    }

    const text = element.textContent;
    element.innerHTML = '';

    [...text].forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.classList.add(spanName);
      span.style.opacity = '0.1'; // Set initial state
      element.appendChild(span);
    });

    // Ensure DOM is updated and layout is calculated
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
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

  gsap.set('.hero-span', {
    opacity: 0,
    y: 20
  });
}


export function charReveal(className, triggerSelector, markers = false, pinOffset = 0) {
  const triggerElement = document.querySelector(`.${triggerSelector}`);

  if (!triggerElement) {
    console.warn(`Trigger element not found: .${triggerSelector}`);
    return null;
  }

  const chars = triggerElement.querySelectorAll(`.${className}`);

  if (chars.length === 0) {
    console.warn(`No characters found: .${className} in .${triggerSelector}`);
    return null;
  }

  // Ensure chars start hidden
  gsap.set(chars, { opacity: 0.1 });

  let scrollTriggerInstance = null;

  // Use IntersectionObserver to DEFER ScrollTrigger registration until the
  // element is near the viewport. This way ScrollTrigger measures the real
  // position after images/content have shifted the layout — not the wrong
  // position calculated at page init time.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        // Stop watching — we only need to register once
        observer.unobserve(triggerElement);

        // Now that layout is settled and the element is near view,
        // register the ScrollTrigger with accurate position data
        scrollTriggerInstance = gsap.to(chars, {
          opacity: 1,
          stagger: {
            each: 0.03,
            from: 'start',
            ease: 'power1.inOut',
          },
          scrollTrigger: {
            trigger: triggerElement,
            start: `top+=${pinOffset} 80%`,
            end: `bottom+=${pinOffset} 65%`,
            scrub: true,
            markers,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    {
      // Fire when the element is 300px away from entering the viewport —
      // gives ScrollTrigger enough runway to set up before user reaches it
      rootMargin: '0px 0px -50px 0px',
      threshold: 0,
    }
  );

  observer.observe(triggerElement);

  // Return an object that mimics the GSAP tween interface so callers
  // expecting .scrollTrigger don't break (it'll be set after observer fires)
  return {
    get scrollTrigger() { return scrollTriggerInstance?.scrollTrigger ?? null; },
    kill() {
      observer.disconnect();
      scrollTriggerInstance?.scrollTrigger?.kill();
      scrollTriggerInstance?.kill();
    },
  };
}