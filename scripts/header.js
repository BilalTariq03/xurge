document.addEventListener('DOMContentLoaded', ()=>{
  const overlay = document.getElementById('logo-overlay');
  const overlayLogo = document.getElementById('overlay-logo');
  const navLogo = document.querySelector('.nav-bar .logo');

  const hasPlayedIntro = sessionStorage.getItem('introPlayed');
  console.log(hasPlayedIntro)
  // Animate the text
  function animateHeroText() {
    gsap.to('.hero-span', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.005
    });
  }

  function startPageAnimation(){
    gsap.from('.left-items .item', {
      y: '100%',
      opacity: 0,
      duration: 0.5,
      stagger: 0.15,
      ease: 'power2.out',
      delay: 0 // Adjust delay to match your logo animation timing
    });


    gsap.fromTo('.right-items .talk-button', {
      y: '100px',
      opacity: 0,
    },
    {
      y: "0px",
      opacity: 1,
      duration: 0.5
    }
    );
  }

  function skipIntroAndShowContent() {
    // Immediately show everything without animation
    navLogo.style.visibility = 'visible';
    overlay.remove();
    document.body.classList.remove('intro-running');
    document.documentElement.style.overflow = '';
    
    // Show content immediately
    gsap.set('.hero-span', { opacity: 1, y: 0 });
    gsap.set('.left-items .item', { opacity: 1, y: 0 });
    gsap.set('.right-items .talk-button', { opacity: 1, y: 0 });
  }


  document.body.classList.add('intro-running')
  document.documentElement.style.overflow = 'hidden';

  function startIntro(){
    const targetRect = navLogo.getBoundingClientRect();
    const startRect = overlayLogo.getBoundingClientRect();

    const scale = targetRect.width / startRect.width;

    const startCenterX = startRect.left + startRect.width / 2;
    const startCenterY = startRect.top  + startRect.height / 2;
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top  + targetRect.height / 2;
    const deltaX = targetCenterX - startCenterX;
    const deltaY = targetCenterY - startCenterY;

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" }
    });

    const shrinkDuration = 0.9; // seconds (change this)
    const fadeDuration = 0.4;   // seconds

    tl.to(overlayLogo, {
      duration: shrinkDuration,
      x: deltaX,
      y: deltaY,
      scale: scale,
      // optionally rotate slightly: rotation: 2,
    })
    .to(overlay, {
      duration: fadeDuration,
      opacity: 0,
      onStart() {
        // reveal the real nav logo right before overlay fully disappears
        navLogo.style.visibility = 'visible';
      },
      onComplete() {
        // cleanup
        document.body.classList.remove('intro-running');
        document.documentElement.style.overflow = ''; // re-enable scroll
        overlay.remove(); // remove overlay from DOM

        startPageAnimation();
        animateHeroText();

        sessionStorage.setItem('introPlayed', 'true');
      }
    });
  }
  if (hasPlayedIntro) {
    // Animation already played in this session, skip it
    skipIntroAndShowContent();
  } else {
    // First time in this session, play the animation
    document.body.classList.add('intro-running');
    document.documentElement.style.overflow = 'hidden';
    if (overlayLogo.complete) {
      // small delay so layout stabilizes
      requestAnimationFrame(() => setTimeout(startIntro, 200));
    } else {
      overlayLogo.addEventListener('load', () => {
        requestAnimationFrame(() => setTimeout(startIntro, 200));
      });
    }
  }
})



const hamburger = document.querySelector('.menu-button')

hamburger.addEventListener('click',()=>{
  const navMenu = document.getElementById('nav-menu')
  navMenu.classList.toggle('show');
  
  hamburger.classList.toggle('fa-bars');
  hamburger.classList.toggle('fa-xmark');
})


document.querySelectorAll('.menu-items .item').forEach((item) => {
  item.addEventListener('click', function(){
    document.querySelectorAll('.menu-items .item').forEach(
      (it)=> it.classList.remove('active')
    );

    this.classList.add('active')
  });
});

document.addEventListener('click', (e)=>{
  const navMenu = document.getElementById('nav-menu')
  const hamburger = document.querySelector('.menu-button')

  if(!navMenu.contains(e.target) && !hamburger.contains(e.target) ){

    if(navMenu.classList.contains('show')){
      hamburger.classList.toggle('fa-bars');
      hamburger.classList.toggle('fa-xmark');
    }

    navMenu.classList.remove('show');

    
  }
})

let lastScrollTop = 0;
const navbar = document.querySelector('.nav-bar');
const floatingButton = document.querySelector('.talk-button-float');

window.addEventListener('scroll', ()=>{
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  if(scrollTop > lastScrollTop){
    navbar.style.top = "-100px";
    floatingButton.classList.add('show')
  }
  else{
    navbar.style.top="0"
    floatingButton.classList.remove('show');
  }

  lastScrollTop = scrollTop<0? 0:scrollTop;
});