import { AnimationBase } from '../core/base.js';

export class VideoAnimation extends AnimationBase {
  constructor() {
    super();
    this.videos = [];
    this.observers = [];
  }

  init() {
    this.setupVideoAnimations();
    this.setupVideoPlayback();
  }

  setupVideoAnimations() {
    const videos = gsap.utils.toArray('.project-video');
    
    videos.forEach((video, index) => {
      // Expand animation from left to right
      const trigger = gsap.fromTo(video,
        {
          scaleX: 0,
          opacity: 0,
          transformOrigin: 'left center'
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: video,
            start: 'top 80%',
            toggleActions: 'play none none none',
            markers: false,
            invalidateOnRefresh: true,
            onEnter: () => {
              // Add playing class when animation starts
              video.classList.add('playing');
            }
          }
        }
      );
      
      this.registerTrigger(trigger.scrollTrigger);
    });
  }

  setupVideoPlayback() {
    const videos = document.querySelectorAll('.project-video');
    
    videos.forEach(video => {
      // Create Intersection Observer for each video
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Video is in viewport - play it
              video.play().catch(err => {
                console.log('Autoplay prevented:', err);
              });
            } else {
              // Video is out of viewport - pause it
              video.pause();
            }
          });
        },
        {
          threshold: 0.1, // Play when 50% of video is visible
          rootMargin: '0px'
        }
      );

      observer.observe(video);
      this.observers.push(observer);
      this.videos.push(video);
    });
  }

  cleanup() {
    // Pause all videos
    this.videos.forEach(video => {
      video.pause();
    });

    // Disconnect all observers
    this.observers.forEach(observer => {
      observer.disconnect();
    });

    // Clear arrays
    this.videos = [];
    this.observers = [];

    // Call parent cleanup
    super.cleanup();
  }
}