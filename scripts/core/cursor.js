export function initCustomCursor() {
  let mouseTick = false;
  const cursorDot = document.querySelector('.cursor-ball');

  if (!cursorDot) return null;

  document.addEventListener('mousemove', (e) => {
    if (!mouseTick) {
      requestAnimationFrame(() => {
        let mouseX = e.clientX - 17;
        let mouseY = e.clientY - 10;
        
        if (cursorDot.classList.contains('work-hover')) {
          mouseX = e.clientX - 50;
          mouseY = e.clientY - 50;
        }
        
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        mouseTick = false;
      });
    }
    mouseTick = true;
  });

   return {
    addHoverEffect: (element, className = 'work-hover') => {
      element.addEventListener('mouseenter', () => {
        cursorDot.classList.add(className);
      });
      element.addEventListener('mouseleave', () => {
        cursorDot.classList.remove(className);
      });
    }
  };
}