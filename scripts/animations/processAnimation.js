// processAnimation.js

export function processDescription() {
  const processSteps = document.querySelectorAll('.process-step');
  const descriptions = document.querySelectorAll('.step-description');
  const processSection = document.querySelector('.process-section');

  if (!processSteps.length || !descriptions.length) {
    return;
  }

  // Add data-step attributes to each process step
  processSteps.forEach((step, index) => {
    step.setAttribute('data-step', index + 1);
  });

  processSteps.forEach(step => {
    const stepNumber = step.getAttribute('data-step');
    
    // Show corresponding description on hover
    step.addEventListener('mouseenter', () => {
      // Hide all descriptions
      descriptions.forEach(desc => desc.classList.remove('active'));
      
      // Show the matching description
      const matchingDescription = document.querySelector(`[data-description="${stepNumber}"]`);
      if (matchingDescription) {
        matchingDescription.classList.add('active');
      }
    });

    step.addEventListener('mouseleave', () => {
    // Hide the matching description when mouse leaves
    const matchingDescription = document.querySelector(`[data-description="${stepNumber}"]`);
    if (matchingDescription) {
      matchingDescription.classList.remove('active');
    }
  });
  });

  // Hide all descriptions when mouse leaves the entire process section
  if (processSection) {
    processSection.addEventListener('mouseleave', () => {
      descriptions.forEach(desc => desc.classList.remove('active'));
    });
  }
}



export function processCircle() {
  const circles = document.querySelectorAll('.step-circle');

  circles.forEach(circle => {

    circle.addEventListener('mouseenter', e => {
      const rect = circle.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      circle.style.setProperty('--x', `${x}px`);
      circle.style.setProperty('--y', `${y}px`);

      gsap.to(circle, {
        '--r': '150%',
        duration: 1.5,
        ease: 'power3.out'
      });
    });

    circle.addEventListener('mousemove', e => {
      const rect = circle.getBoundingClientRect();

      circle.style.setProperty('--x', `${e.clientX - rect.left}px`);
      circle.style.setProperty('--y', `${e.clientY - rect.top}px`);
    });

    circle.addEventListener('mouseleave', e => {
      const rect = circle.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      circle.style.setProperty('--x', `${x}px`);
      circle.style.setProperty('--y', `${y}px`);

      gsap.to(circle, {
        '--r': '0%',
        duration: 1.5,
        ease: 'power3.inOut'
      });
    });
  });
}


