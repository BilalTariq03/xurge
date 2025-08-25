export function initSmoothScrolling() {
  const lenis = new Lenis({
    lerp: 0.1,          
    wheelMultiplier: 1,  
    touchMultiplier: 2,  
    infinite: false 
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  return lenis;
}