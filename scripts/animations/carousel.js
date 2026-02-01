// carousel-synchronized.js - All Carousels Switch Together
export function initCarousel() {
  // Find all carousel containers
  const carouselContainers = document.querySelectorAll('.carousel-container');

  if (!carouselContainers.length) {
    console.warn('No carousel containers found');
    return { cleanup: () => {} };
  }

  // Shared state for all carousels
  let currentIndex = 0;
  let autoplayInterval;
  let isTransitioning = false;

  // Get total images (assuming all carousels have same number)
  const firstCarousel = carouselContainers[0];
  const totalImages = firstCarousel.querySelectorAll('.carousel-image').length;

  function showImage(index) {
    if (isTransitioning) return;
    isTransitioning = true;

    requestAnimationFrame(() => {
      // Update ALL carousels simultaneously
      carouselContainers.forEach(container => {
        const images = container.querySelectorAll('.carousel-image');
        
        images.forEach((img, i) => {
          if (i === index) {
            img.classList.add('active');
          } else {
            img.classList.remove('active');
          }
        });
      });

      setTimeout(() => {
        isTransitioning = false;
      }, 100);
    });
  }

  function changeImage(direction) {
    if (isTransitioning) return;

    currentIndex += direction;
    if (currentIndex >= totalImages) currentIndex = 0;
    if (currentIndex < 0) currentIndex = totalImages - 1;

    showImage(currentIndex);
  }

  function startAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }

    autoplayInterval = setInterval(() => {
      changeImage(1);
    }, 500);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
  }

  // Pause when tab is hidden
  function handleVisibilityChange() {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Initialize all carousels to first image
  showImage(currentIndex);
  
  // Start autoplay after brief delay
  setTimeout(() => {
    startAutoplay();
  }, 500);

  // Return cleanup function
  return {
    cleanup() {
      clearInterval(autoplayInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  };
}