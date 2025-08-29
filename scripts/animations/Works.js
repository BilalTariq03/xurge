import { AnimationBase } from "../core/base.js";

export class WorksAnimation extends AnimationBase{
  init(){
    this.setupWorksHeroText();
    this.setupHorizontalScroll();
    this.smoothItemScroll();
  }

  setupWorksHeroText(){
    if(document.querySelector(".works-hero-text")){
      const trigger = gsap.to(".works-hero-text", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".works-hero-text",
          start: "top 70%",
          toggleActions: "play none none none"
        }
      });

      this.registerTrigger(trigger.scrollTrigger)
    }    
  }
  
  setupHorizontalScroll(){
    if(!this.mm) this.mm = gsap.matchMedia();

    this.mm.add("(min-width: 990px)", ()=>{
      const hero = document.querySelector('.works-container');
      const wrapper = document.querySelector('.scroll-wrapper');
      const workList = document.querySelector('.work-item-list');

      if (!hero || !wrapper || !workList) return;

      const totalScroll = wrapper.scrollWidth - window.innerWidth;

      // console.log(totalScroll)

      const tl = gsap.timeline({
        scrollTrigger:{
          trigger: '.works-section',
          start: 'top top',
          end: () => `+=${totalScroll}`,
          scrub: true,
          pin: true,
          anticipatePin: true,
          invalidateOnRefresh: true,
          // markers: true
        }
      })
      .to(hero,{
        filter: 'blur(8px)',
        duration: 0.2
      }, 0.05)
      .to(workList, {
        x: () => `-${totalScroll}px`,
        ease: 'none'
      },0)

      this.registerTrigger(tl.scrollTrigger);

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      return () =>{
        tl.scrollTrigger && tl.scrollTrigger.kill();
        tl.kill();
      };
    });
  }

  smoothItemScroll(){
    const workItems = document.querySelectorAll('.item-container');

    if(workItems.length>0){
      workItems.forEach((item, index)=>{
        const animation = gsap.fromTo(item,{
          opacity: 0,
          y: 50
        },
          {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top bottom-=100",
            toggleActions: "play none none none",
            // markers: true
          }
        });
        this.registerTrigger(animation.scrollTrigger);
      })
    }
  }
}

  