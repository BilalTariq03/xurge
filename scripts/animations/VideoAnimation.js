import { AnimationBase } from '../core/base.js';

export class VideoAnimation extends AnimationBase {
  constructor() {
    super();
    this.videos = [];
    this._observers = [];
  }

  init() {
    this.setupVideoAnimations();
  }

  setupVideoAnimations() {
    const videos = document.querySelectorAll('.project-video');
    if (!videos.length) return;

    // Hide all videos immediately
    gsap.set(videos, { opacity: 0, scaleX: 0, transformOrigin: 'left center' });

    videos.forEach(video => {
      this.videos.push(video);

      // Single observer handles both the enter animation AND play/pause
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Animate in (only once)
              if (!video._animated) {
                video._animated = true;
                gsap.to(video, {
                  scaleX: 1,
                  opacity: 1,
                  duration: 1,
                  ease: 'power3.out',
                });
              }

              // Play
              video.play().catch(() => {});
            } else {
              // Pause when out of view
              video.pause();
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -10% 0px',
        }
      );

      observer.observe(video);
      this._observers.push(observer);
    });
  }

  cleanup() {
    this.videos.forEach(v => v.pause());
    this._observers.forEach(o => o.disconnect());
    this.videos = [];
    this._observers = [];
    super.cleanup();
  }
}