import { AnimationBase } from "../core/base.js";

export class ImageAnimation extends AnimationBase{
  init(){
    this.smoothImageScroll();
  }

  smoothImageScroll() {
  const images = document.querySelectorAll('.img-anim');

  images.forEach(img => {
    gsap.fromTo(
      img,
      {
        opacity: 0,
        y: 50
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: img,
          start: 'top 85%',
          once: true
        }
      }
    );
  });
}

}