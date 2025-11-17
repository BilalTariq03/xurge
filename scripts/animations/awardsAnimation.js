import { AnimationBase } from "../core/base.js";

export class awardsAnimation extends AnimationBase{

  init(){
    this.setupAwardsAnimation();
  }

  setupAwardsAnimation(){
    const listItems = document.querySelectorAll('.list-item');

    listItems.forEach(item=>{
      const awardImage = item.querySelector('.award-image img')

      item.addEventListener('mousemove', function(e){
        const rect = item.getBoundingClientRect();
        const itemWidth = rect.width;
        const mouseX = e.clientX - rect.left

        const centerX = itemWidth/2;
        const maxRotation =5;
        const maxTranslation = 50;

        const rotation = ((mouseX - centerX)/centerX) * maxRotation
        const translation = ((mouseX - centerX)/centerX) * maxTranslation

        awardImage.style.transform = `rotate(${rotation}deg) translateX(${translation}px)`
      });
      item.addEventListener('mouseleave', function(){
        awardImage.style.transform = 'rotate(0deg) translateX(0px)';
      })
    })
  }
}
