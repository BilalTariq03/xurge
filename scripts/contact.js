// ===== js/main.js =====
import { initCustomCursor } from './core/cursor.js';
import { initPageTransitions } from "./core/pageTransition.js";
class AnimationManager {
  constructor() {
    this.cursor = null;
    this.lenis = null;
  }

  init() {
    this.cursor = initCustomCursor();
    this.initContactForm();

    initPageTransitions();
  }

  initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return; // ← guard: skip if not on contact page

    const submitBtn = document.getElementById('submitBtn');
    const successMsg = document.getElementById('successMsg');
    const errorMsg = document.getElementById('errorMsg');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function clearMessages() {
      successMsg.classList.remove('visible');
      errorMsg.classList.remove('visible');
    }

    function validateField(input, errorEl, validator) {
      const valid = validator(input.value.trim());
      input.classList.toggle('error', !valid);
      errorEl.classList.toggle('visible', !valid);
      return valid;
    }

    document.getElementById('name').addEventListener('blur', function() {
      validateField(this, document.getElementById('nameError'), v => v.length >= 2);
    });
    document.getElementById('email').addEventListener('blur', function() {
      validateField(this, document.getElementById('emailError'), v => emailRegex.test(v));
    });
    document.getElementById('message').addEventListener('blur', function() {
      validateField(this, document.getElementById('messageError'), v => v.length >= 10);
    });

    ['name', 'email', 'message'].forEach(id => {
      document.getElementById(id).addEventListener('focus', function() {
        this.classList.remove('error');
        document.getElementById(id + 'Error').classList.remove('visible');
      });
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      clearMessages();

      const nameOk    = validateField(document.getElementById('name'),    document.getElementById('nameError'),    v => v.length >= 2);
      const emailOk   = validateField(document.getElementById('email'),   document.getElementById('emailError'),   v => emailRegex.test(v));
      const messageOk = validateField(document.getElementById('message'), document.getElementById('messageError'), v => v.length >= 10);

      if (!nameOk || !emailOk || !messageOk) return;

      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        form.reset();

        const success = Math.random() > 0.1;
        if (success) {
          successMsg.classList.add('visible');
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          errorMsg.classList.add('visible');
          errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 1800);
    });

    document.getElementById('bookCall').addEventListener('click', function(e) {
      e.preventDefault();
      alert('Calendly integration would open here.');
    });
  }
}

const animationManager = new AnimationManager();
window.AnimationManager = animationManager;

// ← this was missing
window.addEventListener('load', () => {
  animationManager.init();
});