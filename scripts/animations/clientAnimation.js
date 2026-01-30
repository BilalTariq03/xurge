import { AnimationBase } from "../core/base.js";
import { charReveal, AddSpans } from "../utils/text-utils.js";
import { revealUpOnScroll } from "../utils/reveal-text.js";

export class clientAnimation extends AnimationBase{
  init(){
    AddSpans('.clients-container .title', 'title-char');
    charReveal('title-char', 'clients-container .title');

    this.textFloatAnimation();
    this.logoFloatAnimation();
  }

  textFloatAnimation(){
    const el = document.querySelector('.clients-container .description');
    if (!el) return;

    const anim = revealUpOnScroll(el);
    this.registerTrigger(anim.scrollTrigger);
  }

  logoFloatAnimation(){
    const clientLogos = document.querySelectorAll('.client-logo');
    clientLogos.forEach((logo) => {
      const trigger = gsap.fromTo(logo, {
        y: 50,
        opacity: 0
      },{
        y:0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger:{
          trigger: logo,
          start: "top 80%",
        }
      });

      this.registerTrigger(trigger.scrollTrigger);
    });
    
  }
}