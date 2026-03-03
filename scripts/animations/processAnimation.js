export function processDescription() {
  if (window.innerWidth <= 768) return; // descriptions shown inline via CSS

  const processSteps = document.querySelectorAll('.process-step');
  const descriptions = document.querySelectorAll('.step-description');
  const processSection = document.querySelector('.process-section');

  if (!processSteps.length || !descriptions.length) return;

  processSteps.forEach((step, index) => {
    step.setAttribute('data-step', index + 1);
  });

  processSteps.forEach(step => {
    const stepNumber = step.getAttribute('data-step');

    step.addEventListener('mouseenter', () => {
      descriptions.forEach(desc => desc.classList.remove('active'));
      const match = document.querySelector(`[data-description="${stepNumber}"]`);
      if (match) match.classList.add('active');
    });

    step.addEventListener('mouseleave', () => {
      const match = document.querySelector(`[data-description="${stepNumber}"]`);
      if (match) match.classList.remove('active');
    });
  });

  if (processSection) {
    processSection.addEventListener('mouseleave', () => {
      descriptions.forEach(desc => desc.classList.remove('active'));
    });
  }
}

export function processCircle() {
  if (window.innerWidth <= 768) return; // no hover fill on touch screens

  const circles = document.querySelectorAll('.step-circle');

  circles.forEach(circle => {
    circle.addEventListener('mouseenter', e => {
      const rect = circle.getBoundingClientRect();
      circle.style.setProperty('--x', `${e.clientX - rect.left}px`);
      circle.style.setProperty('--y', `${e.clientY - rect.top}px`);
      gsap.to(circle, { '--r': '150%', duration: 1.5, ease: 'power3.out' });
    });

    circle.addEventListener('mousemove', e => {
      const rect = circle.getBoundingClientRect();
      circle.style.setProperty('--x', `${e.clientX - rect.left}px`);
      circle.style.setProperty('--y', `${e.clientY - rect.top}px`);
    });

    circle.addEventListener('mouseleave', e => {
      const rect = circle.getBoundingClientRect();
      circle.style.setProperty('--x', `${e.clientX - rect.left}px`);
      circle.style.setProperty('--y', `${e.clientY - rect.top}px`);
      gsap.to(circle, { '--r': '0%', duration: 1.5, ease: 'power3.inOut' });
    });
  });
}