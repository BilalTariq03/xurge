import { AnimationBase } from "../core/base.js";

export class StatsAnimation extends AnimationBase{
  init(){
    const counters = document.querySelectorAll('.stats-heading');
    const statsSection = document.querySelector('.stats-section');

    if (!counters.length || !statsSection) return;

    counters.forEach((counter)=>{
      const target = +counter.dataset.target;

      const trigger = gsap.fromTo(counter,
        { innerText: 0},
        {
          innerText: target,
          duration: 3,
          ease: "power1.out",
          scrollTrigger: {
            trigger: statsSection,
            start: `top 90%`,
            // markers: true,
            toggleActions: "play none none none"
          },
          snap: { innerText: 1},
          onUpdate: function (){
            const value = Math.round(counter.innerText);
            counter.textContent = value + (counter.id=='percent'?"%":"+")
          }
        }
      );

      this.registerTrigger(trigger.scrollTrigger);
    })
  }
}
