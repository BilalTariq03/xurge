// serviceStack.js - Simple Working Solution
export class ServiceStackAnimation {
  init() {
    gsap.registerPlugin(ScrollTrigger);

    const sections = gsap.utils.toArray(".service-section");

    if (!sections.length) {
      console.warn('No service sections found');
      return;
    }

    sections.forEach((section, index) => {
      // Skip the last section
      if (index === sections.length - 1) return;

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        scrub: 1,
        // markers: true, // Uncomment to debug
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Current section moves back in Z-space
          const scale = 1 - (progress * 0.2); // 1 → 0.8
          const blur = progress * 10; // 0 → 10px
          const opacity = 1 - (progress * 1.2); // 1 → 0.5
          
          section.style.transform = `scale(${scale})`;
          section.style.filter = `blur(${blur}px)`;
          section.style.opacity = opacity;
        }
      });
    });
  }

  cleanup() {
    ScrollTrigger.getAll().forEach(t => t.kill());
    
    const sections = gsap.utils.toArray(".service-section");
    sections.forEach(section => {
      section.style.transform = '';
      section.style.filter = '';
      section.style.opacity = '';
    });
  }
}