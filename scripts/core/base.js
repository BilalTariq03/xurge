export class AnimationBase {
  constructor() {
    this.mm = null;
    this.savedScrollPosition = 0;
    this.triggers = [];
  }

  saveScrollPosition() {
    this.savedScrollPosition = window.pageYOffset;
  }

  restoreScrollPosition() {
    requestAnimationFrame(() => {
      window.scrollTo(0, this.savedScrollPosition);
    });
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

  cleanup() {
    if (this.mm) {
      this.mm.revert();
    }
    this.triggers.forEach(trigger => trigger.kill());
    this.triggers = [];
  }

  registerTrigger(trigger) {
    this.triggers.push(trigger);
  }
}