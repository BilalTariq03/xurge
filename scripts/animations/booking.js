import { AnimationBase } from "../core/base.js";
import { charReveal } from "../utils/text-utils.js";


export class BookingAnimation extends AnimationBase{
  init(){
    this.setupBookingAnimation();
  }

  setupBookingAnimation(){
    charReveal('heading-char', 'booking-heading');

    if(!this.mm) this.mm = gsap.matchMedia();
    this.mm.add("(min-width: 990px)", ()=>{
      const trigger = gsap.fromTo(".book-image",
        {y:800},
        {
          y:0,
          stagger:0.2,
          ease:'none',
          scrollTrigger:{
            trigger:".booking-section",
            start:"top center",
            end: "top top+=100",
            scrub: 1,
            markers: false,
            invalidateOnRefresh: true
          }
        }
      );
      this.registerTrigger(trigger.scrollTrigger);
      
      return () => {
        trigger.scrollTrigger && trigger.scrollTrigger.kill();
      };
    })

    this.mm.add("(max-width: 990px) and (min-width: 601px)", () => {
      const bookingSection = document.querySelector(".booking-section");
      const bookingContent = document.querySelector(".booking-content");
      const images = gsap.utils.toArray(".book-image");

      if (!bookingSection || !bookingContent || !images.length) return;

      const gap = () => Math.round(window.innerHeight * 0.55);
      const animLen = () => Math.round(window.innerHeight * 1);
      const totalDuration = () => (images.length - 3) * gap() + animLen() + window.innerHeight;

      const pinTrigger = ScrollTrigger.create({
        trigger: bookingSection,
        start: "top top",
        end: () => `+=${totalDuration()}`,
        pin: bookingContent,
        pinSpacing: false,
        invalidateOnRefresh: true
      });

      this.registerTrigger(pinTrigger)

      images.forEach(img => gsap.set(img, { y: () => window.innerHeight + 500, opacity: 1 }));

      const imageTriggers = images.map((img, i) => {
        const trigger = gsap.to(img, {
          y: 0,
          ease: "none",
          scrollTrigger: {
            start: () => bookingSection.offsetTop + i * gap(),
            end: () => bookingSection.offsetTop + i * gap() + animLen(),
            scrub: 0.5,
            invalidateOnRefresh: true
          }
        });
        this.registerTrigger(trigger.scrollTrigger);
        return trigger;
      });

      return () => {
        pinTrigger.kill();
        imageTriggers.forEach(t => t.kill && t.kill());
        images.forEach(img => gsap.set(img, { clearProps: "y,opacity" }));
      };
    });

    this.mm.add("(max-width: 600px)", () => {
      const bookingSection = document.querySelector(".booking-section");
      const bookingContent = document.querySelector(".booking-content");
      const images = gsap.utils.toArray(".book-image");

      if (!bookingSection || !bookingContent || !images.length) return;

      const gap = () => Math.round(window.innerHeight * 0.55);
      const animLen = () => Math.round(window.innerHeight * 1);
      const totalDuration = () => (images.length - 3.755) * gap() + animLen() + window.innerHeight;

      const pinTrigger = ScrollTrigger.create({
        trigger: bookingSection,
        start: "top top",
        end: () => `+=${totalDuration()}`,
        pin: bookingContent,
        pinSpacing: false,
        invalidateOnRefresh: true
      });

      this.registerTrigger(pinTrigger);

      images.forEach(img => gsap.set(img, { y: () => window.innerHeight + 500, opacity: 1 }));

      const imageTriggers = images.map((img, i) => {
        const trigger = gsap.to(img, {
          y: 0,
          ease: "none",
          scrollTrigger: {
            start: () => bookingSection.offsetTop + i * gap(),
            end: () => bookingSection.offsetTop + i * gap() + animLen(),
            scrub: 0.5,
            invalidateOnRefresh: true
          }
        });
        this.registerTrigger(trigger.scrollTrigger);
        return trigger;
      });

      return () => {
        pinTrigger.kill();
        imageTriggers.forEach(t => t.kill && t.kill());
        images.forEach(img => gsap.set(img, { clearProps: "y,opacity" }));
      };
    });
    }
}