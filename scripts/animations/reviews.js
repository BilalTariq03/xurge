import { AnimationBase } from '../core/base.js';
import { AddSpans, charReveal } from '../utils/text-utils.js';

export class ReviewsAnimation extends AnimationBase {
  init() {
    // Add spans to review heading
    AddSpans('.review-heading', 'review-char');
    
    // Character reveal animation
    charReveal('review-char', 'review-heading');
    
    // Setup reviews carousel
    this.setupReviewsCarousel();
  }

  setupReviewsCarousel() {
    const reviewStrip = document.querySelector('.review-strip');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');

    if (!reviewStrip || !prevButton || !nextButton) return;

    // Clone review items if not already done
    if (!reviewStrip.dataset.cloned) {
      const reviewItems = Array.from(reviewStrip.children);

      reviewItems.forEach((item) => {
        reviewStrip.appendChild(item.cloneNode(true));
      });
      
      for (let i = reviewItems.length - 1; i >= 0; i--) {
        reviewStrip.insertBefore(reviewItems[i].cloneNode(true), reviewStrip.firstChild);
      }
      
      reviewStrip.dataset.cloned = '1';
    }

    let reviewItems = Array.from(document.querySelectorAll('.review-item'));
    const itemWidth = reviewItems[0].offsetWidth + 8;
    let currentIndex = reviewItems.length / 3;
    let draggable;

    const containerWidth = reviewStrip.parentElement.offsetWidth;
    const offset = (containerWidth - itemWidth) / 2;
    const startPosition = currentIndex * itemWidth - offset;
    let startX = 0;

    gsap.set(reviewStrip, { x: -startPosition });

    // Update active card
    const updateActiveCard = (centerIndex) => {
      const old = reviewStrip.querySelector('.review-item.active');
      const current = reviewItems[centerIndex];

      if (old && old !== current) old.classList.remove('active');
      current.classList.add('active');
    };

    // Initialize draggable
    const initDraggable = () => {
      draggable = Draggable.create(reviewStrip, {
        type: "x",
        edgeResistance: 0.8,
        inertia: true,
        onPress() {
          startX = gsap.getProperty(reviewStrip, 'x');
        },
        onDragEnd: snapWithThreshold,
        onThrowComplete: snapWithThreshold
      })[0];
    };

    // Snap with threshold
    const snapWithThreshold = () => {
      const endX = gsap.getProperty(reviewStrip, 'x');
      const delta = endX - startX;
      const threshold = containerWidth / 4;
      let newIndex = currentIndex;

      if (delta < -threshold) {
        newIndex = currentIndex + 1;
      } else if (delta > threshold) {
        newIndex = currentIndex - 1;
      }

      goToReview(newIndex);
    };

    // Go to specific review
    const goToReview = (index) => {
      const itemsPerSet = reviewItems.length / 3;
      
      if (index < 1) {
        currentIndex = 2 * itemsPerSet - 1;
        const targetPosition = currentIndex * itemWidth - offset;
        gsap.set(reviewStrip, { x: -targetPosition });
        index = currentIndex - 1;
      } else if (index >= reviewItems.length - 1) {
        currentIndex = itemsPerSet;
        const targetPosition = currentIndex * itemWidth - offset;
        gsap.set(reviewStrip, { x: -targetPosition });
        index = currentIndex + 1;
      }

      currentIndex = index;
      const targetPosition = currentIndex * itemWidth - offset;

      gsap.to(reviewStrip, {
        x: -targetPosition,
        duration: 0.7,
        ease: "power2.out",
        onUpdate: () => updateActiveCard(currentIndex),
        onComplete: () => {
          if (currentIndex < itemsPerSet) {
            currentIndex += itemsPerSet;
            const newPosition = currentIndex * itemWidth - offset;
            gsap.set(reviewStrip, { x: -newPosition });
          } else if (currentIndex >= 2 * itemsPerSet) {
            currentIndex -= itemsPerSet;
            const newPosition = currentIndex * itemWidth - offset;
            gsap.set(reviewStrip, { x: -newPosition });
          }
          updateActiveCard(currentIndex);
        }
      });
    };

    // Event listeners for buttons
    prevButton.addEventListener('click', () => goToReview(currentIndex - 1));
    nextButton.addEventListener('click', () => goToReview(currentIndex + 1));

    // Initialize draggable after slight delay
    setTimeout(() => {
      initDraggable();
      updateActiveCard(currentIndex);
    }, 100);

    // Add hover effect to review strip
    reviewStrip.addEventListener('mouseenter', () => {
      document.querySelector('.cursor-ball')?.classList.add('drag-hover');
    });

    reviewStrip.addEventListener('mouseleave', () => {
      document.querySelector('.cursor-ball')?.classList.remove('drag-hover');
    });
  }
}