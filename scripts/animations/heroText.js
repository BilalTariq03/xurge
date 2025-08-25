// animations.js
export function animateHeroText() {
    gsap.to('.hero-span', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.005
    });
}