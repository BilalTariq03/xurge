let assetsToLoad = [];
let loadedAssets = 0;
let isReady = false;

let loadingScreen, overlay, overlayLogo, navLogo, mainContent, heroText;
let hasPlayedIntro;

function initializeElements() {
    console.log('Initializing elements...');
    
    // Get all DOM element references
    loadingScreen = document.getElementById('loading-screen');
    overlay = document.getElementById('logo-overlay');
    overlayLogo = document.getElementById('overlay-logo');
    navLogo = document.querySelector('.nav-bar .logo');
    mainContent = document.querySelector('.main-content');
    heroText = document.querySelector('.hero-text');
    
    // Check if intro was already played
    hasPlayedIntro = sessionStorage.getItem('introPlayed') === 'true';
}

function preloadAssets() {
    assetsToLoad = [];
    loadedAssets = 0;
    
    const imagesToPreload = [
        './images/SVG/XurgeLogo.svg',
        './images/XurgeAnimation.png',
    ];
    
    const fontsToPreload = [
        // Add any custom fonts here if you're using them
        // 'https://fonts.googleapis.com/css2?family=YourFont:wght@400;700&display=swap'
    ];
    
    imagesToPreload.forEach((src, index) => {
        if (src) {
          const img = new Image();
          img.onload = function() {
            onAssetLoaded();
          };    
          // If image fails to load, still continue (graceful degradation)
          img.onerror = function() {
            console.warn(`Failed to load image: ${src}, but continuing...`);
            onAssetLoaded();
          };      
          img.src = src;
          assetsToLoad.push(img);
        }
    });
    
    // If no assets to preload, proceed immediately
    if (assetsToLoad.length === 0) {
        onAllAssetsLoaded();
    }
}

function onAssetLoaded() {
    loadedAssets++;
    const progress = Math.round((loadedAssets / assetsToLoad.length) * 100);    
    if (loadedAssets >= assetsToLoad.length) {
        onAllAssetsLoaded();
    }
}

function onAllAssetsLoaded() {
    isReady = true;    
    setTimeout(() => {
        hideLoadingScreen();
    }, 500);
}

function hideLoadingScreen() {
    if (!loadingScreen) {
        proceedAfterLoading();
        return;
    }
        
    gsap.to(loadingScreen, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: function() {
            loadingScreen.style.display = 'none';
            proceedAfterLoading();
        }
    });
}

function proceedAfterLoading() {
    if (hasPlayedIntro) {
        skipIntroAndShowContent();
    } else {
        startIntroAnimation();
    }
}

function skipIntroAndShowContent() {
    console.log('Skipping intro, showing content immediately...');
    if (navLogo) {
        navLogo.style.visibility = 'visible';
    }
    
    if (overlay) {
        overlay.remove();
    }
    
    document.body.classList.remove('intro-running');
    document.documentElement.style.overflow = '';
    
    if (mainContent) {
      gsap.to(mainContent, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.5,
        onComplete: function() {
            console.log('Content revealed, animating page elements...');
            // Call your existing functions
            animateHeroText();
            startPageAnimation();
        }
      });
    } else {
        // If no main-content wrapper, just animate the existing elements
        animateHeroText();
        startPageAnimation();
    }
}

function startIntroAnimation() {    
    // Prevent scrolling during intro
    document.body.classList.add('intro-running');
    document.documentElement.style.overflow = 'hidden';
    
    // Show main content if it exists (but nav logo stays hidden)
    if (mainContent) {
        gsap.set(mainContent, { opacity: 1, visibility: 'visible' });
    }
    
    // Show overlay and start animation
    if (overlay && overlayLogo) {
      gsap.set(overlay, { opacity: 1, visibility: 'visible' });
      
      // Small delay for layout to settle, then run the main animation
      requestAnimationFrame(() => {
          setTimeout(() => runIntroAnimation(), 100);
      });
    } else {
        skipIntroAndShowContent();
    }
}

function runIntroAnimation() {    
    // Safety check for required elements
    if (!navLogo || !overlayLogo) {
        skipIntroAndShowContent();
        return;
    }
    
    // Calculate positions for the morphing effect
    const targetRect = navLogo.getBoundingClientRect();
    const startRect = overlayLogo.getBoundingClientRect();
    
    // Prevent division by zero
    if (startRect.width === 0 || targetRect.width === 0) {
        skipIntroAndShowContent();
        return;
    }
    
    const scale = targetRect.width / startRect.width;
    const startCenterX = startRect.left + startRect.width / 2;
    const startCenterY = startRect.top + startRect.height / 2;
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    const deltaX = targetCenterX - startCenterX;
    const deltaY = targetCenterY - startCenterY;
        
    // Create the animation timeline
    const tl = gsap.timeline({
        defaults: { ease: "power3.out" }
    });
    
    // Animate logo elements appearing (your existing animation)
    tl.fromTo(overlayLogo.querySelectorAll('.cls-1'), 
      {
        y: 100,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.05
      }
    )
    // Move and scale logo to nav position
    .to(overlayLogo, {
        duration: 0.9,
        x: deltaX,
        y: deltaY,
        scale: scale,
        transformOrigin: "center center"
    })
    // Fade out overlay and reveal nav logo
    .to(overlay, {
        duration: 0.4,
        opacity: 0,
        onStart: function() {
          navLogo.style.visibility = 'visible';
        },
        onComplete: function() {
          
          // Cleanup and enable scrolling
          document.body.classList.remove('intro-running');
          document.documentElement.style.overflow = '';
          overlay.remove();
          
          // Animate other page elements
          animateHeroText();
          startPageAnimation();
          
          // Mark intro as played
          sessionStorage.setItem('introPlayed', 'true');
        }
    });
}

function animateHeroText() {
    gsap.to('.hero-span', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.005
    });
}

function startPageAnimation() {    
  gsap.from('.left-items .item', {
    y: '100%',
    opacity: 0,
    duration: 0.5,
    stagger: 0.15,
    ease: 'power2.out',
    delay: 0
  });

  gsap.fromTo('.right-items .talk-button', {
    y: '100px',
    opacity: 0,
  }, {
    y: "0px",
    opacity: 1,
    duration: 0.5
  });
}

function initializeLoadingSystem() {    
  try {
    initializeElements();
    preloadAssets(); 
  } catch (error) {
      console.error('Error during loading system initialization:', error);
      skipIntroAndShowContent();
  }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeLoadingSystem();
});

if (document.readyState === 'loading') {
  console.log('DOM still loading, waiting for DOMContentLoaded...');
} else {
  console.log('DOM already loaded, starting loading system immediately...');
  initializeLoadingSystem();
}


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