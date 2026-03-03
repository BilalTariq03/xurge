export class ServiceStackAnimation {
  init() {
    gsap.registerPlugin(ScrollTrigger);

    // Skip the stacking animation entirely on small screens —
    // height: auto sections can't be pinned meaningfully
    if (window.innerWidth <= 768) return;

    const sections = gsap.utils.toArray('.service-section');
    if (!sections.length) return;

    sections.forEach((section, index) => {
      if (index === sections.length - 1) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        pin: true,
        pinSpacing: false,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          section.style.transform = `scale(${1 - progress * 0.2})`;
          section.style.filter   = `blur(${progress * 10}px)`;
          section.style.opacity  = 1 - progress * 1.2;
        }
      });
    });
  }

  cleanup() {
    ScrollTrigger.getAll().forEach(t => t.kill());

    gsap.utils.toArray('.service-section').forEach(section => {
      section.style.transform = '';
      section.style.filter    = '';
      section.style.opacity   = '';
    });
  }
}