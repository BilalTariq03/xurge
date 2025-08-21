import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const lenis = new Lenis({
  lerp: 0.1,          
  wheelMultiplier: 1,  
  touchMultiplier: 2,  
  infinite: false 
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

let mouseTick = false;
const cursorDot = document.querySelector('.cursor-dot')

document.addEventListener('mousemove', (e)=>{
  if(!mouseTick){
    window.requestAnimationFrame(()=>{
      const cursorWidth = cursorDot.offsetWidth;
      const cursorHeight = cursorDot.offsetHeight
      let mouseX = e.clientX-17;
      let mouseY = e.clientY-10;
      if(cursorDot.classList.contains('work-hover'))
      {
        mouseX = e.clientX-50;
        mouseY = e.clientY -50;
        
      }
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`
        mouseTick=false;
    });
  }
  mouseTick=true;
})

function AddSpans(className,spanName){
  const currentText = document.querySelector(`.${className}`);
  const text = currentText.textContent;

  currentText.innerHTML = '';

  [...text].forEach((char) =>{
    const span = document.createElement('span');
    span.textContent = char;
    span.classList.add(spanName);
    currentText.appendChild(span);
  })
}

const animationContainer = document.querySelector('.animation-container');

// brand logos
const columns = document.querySelectorAll('.logo-column');

columns.forEach((column, index)=>{
  const logos = column.querySelectorAll('.logo');

  logos.forEach(logo => {
    const clone = logo.cloneNode(true);
    column.append(clone);
  });
});

//about-info
AddSpans('about','about-char')

const workItemList = document.querySelector('.work-item-list');

workItemList.addEventListener('mouseenter', ()=>{
  cursorDot.classList.add('work-hover')
})

workItemList.addEventListener('mouseleave', ()=>{
  cursorDot.classList.remove('work-hover')
})

document.querySelectorAll('.work-book').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
  });
});

// booking-container
AddSpans('booking-heading','heading-char')

// stats - container
const counters = document.querySelectorAll('.stats-heading');

counters.forEach((counter)=>{
  const target = +counter.dataset.target;

  gsap.fromTo(counter,
    { innerText: 0},
    {
      innerText: target,
      duration: 3,
      ease: "power1.out",
      scrollTrigger: {
        trigger: counter,
        start: "top bottom-=2100",
        // markers: true,
        toggleActions: "play none none none"
      },
      snap: { innerText: 1},
      onUpdate: function (){
        const value = Math.round(counter.innerText);
        counter.textContent = value + (counter.id=='percent'?"%":"+")
      }
    }
  )
})

// Split text into spans without whitespace issues
function prepareHeroText() {
  const lines = document.querySelectorAll('.hero-text .line');

  lines.forEach(line => {
    // avoid re-processing
    if (line.dataset.processed) return;

    // collect text nodes only (keeps markup like <span class="stone-color">)
    const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(node => {
      const text = node.textContent;
      const fragment = document.createDocumentFragment();

      // split into words and spaces (preserves punctuation attached to word)
      const parts = text.match(/\S+|\s+/g) || [];

      parts.forEach(part => {
        if (/\s+/.test(part)) {
          // keep whitespace as text node
          fragment.appendChild(document.createTextNode(part));
        } else {
          // word -> create a wrapper so the whole word stays together
          const wordEl = document.createElement('span');
          wordEl.className = 'hero-word';

          // split word into letter spans
          [...part].forEach(char => {
            const span = document.createElement('span');
            span.className = 'hero-span';
            span.textContent = char;
            wordEl.appendChild(span);
          });

          fragment.appendChild(wordEl);
        }
      });

      node.replaceWith(fragment);
    });

    // Also process any existing inline elements like .stone-color
    line.querySelectorAll('.stone-color').forEach(el => {
      if (el.dataset.processed) return;
      const txt = el.textContent;
      el.innerHTML = '';

      const parts = txt.match(/\S+|\s+/g) || [];
      parts.forEach(part => {
        if (/\s+/.test(part)) {
          el.appendChild(document.createTextNode(part));
        } else {
          const wordEl = document.createElement('span');
          wordEl.className = 'hero-word';
          [...part].forEach(char => {
            const span = document.createElement('span');
            span.className = 'hero-span';
            span.textContent = char;
            wordEl.appendChild(span);
          });
          el.appendChild(wordEl);
        }
      });

      el.dataset.processed = '1';
    });

    line.dataset.processed = '1';
  });
}

// Initialize when ready
prepareHeroText();

gsap.registerPlugin(ScrollTrigger);
let mm = null;

// Store current scroll position before any major operations
let savedScrollPosition = 0;

function saveScrollPosition() {
  savedScrollPosition = window.pageYOffset;
}

function restoreScrollPosition() {
  // Use requestAnimationFrame to ensure DOM is ready
  requestAnimationFrame(() => {
    window.scrollTo(0, savedScrollPosition);
  });
}

// Debounce function to prevent excessive resize calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function initAnimations(){
  // Save current scroll position before making changes
  saveScrollPosition();
  
  // More selective cleanup - only kill triggers that need updating
  const triggers = ScrollTrigger.getAll();
  triggers.forEach(trigger => {
    // Only kill triggers that are resolution-dependent
    if (trigger.vars.invalidateOnRefresh || 
        (trigger.vars.pin && trigger.vars.anticipatePin)) {
      trigger.kill();
    }
  });

  if(mm){
    mm.revert();
  }

  mm = gsap.matchMedia();

  function charReveal(className, triggerName, markers = false, pinOffset = 0) {
    gsap.to(`.${className}`, {
      opacity: 1,
      stagger: {
        each: 0.3,
        from: 'start',
        ease: 'power1.inout'
      },
      scrollTrigger: {
        trigger: `.${triggerName}`,
        start: `top+=${pinOffset} 80%`,
        end: `bottom+=${pinOffset} 65%`,
        scrub: true,
        markers,
        invalidateOnRefresh: true // Mark for cleanup on resize
      }
    });
  }

  //about-info
  if(window.innerWidth > 990) {
    charReveal('about-char', 'about', false, 2000);
  } else {
    charReveal('about-char', 'about', false, 1000)
  }

  //video scale
  gsap.to('.animation-container', {
    scale: 1.12,
    ease: "power2.out",
    scrollTrigger:{
      trigger: ".animation-container",
      start: "top center",
      end: "top top",
      scrub: true,
      invalidateOnRefresh: true
    }
  });
  
  mm.add("(min-width: 990px)", () =>{
    gsap.fromTo('.xurge-animation', 
      {y: '100vh', scale: '1'},
      {
        y: '0vh',
        scale: '4',
        ease: "power1.out",
        scrollTrigger: {
          trigger: '.animation-container-wrapper',
          start: "top top",
          end: "+=2000",
          pin: true,
          anticipatePin: true,
          scrub: true,
          invalidateOnRefresh: true
        }
      }
    ) 
  })

  mm.add("(max-width: 990px)", ()=>{
    gsap.fromTo('.xurge-animation', 
      {y: '70vh', scale: '1'},
      {
        y: '15vh',
        scale: '4',
        ease: "power1.out",
        scrollTrigger: {
          trigger: '.animation-container-wrapper',
          start: "top top",
          end: "+=1000",
          pin: true,
          anticipatePin: true,
          scrub: true,
          invalidateOnRefresh: true
        }
      }
    )  
  })

  // works-container
  gsap.to(".works-hero-text", {
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

  mm.add("(min-width: 990px)", ()=>{
    const hero = document.querySelector('.works-container');
    const wrapper = document.querySelector('.scroll-wrapper');
    const workList = document.querySelector('.work-item-list');
    const itemCount = document.querySelectorAll('.work-item').length;

    const totalScroll = wrapper.scrollWidth - window.innerWidth;

    const tl = gsap.timeline({
      scrollTrigger:{
        trigger: '.works-section',
        start: 'top top',
        end: () => `+=${totalScroll}`,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
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

    return () =>{
      tl.scrollTrigger && tl.scrollTrigger.kill();
      tl.kill();
    };
  });

  // Services section elements
// Services section elements
const servicesSection = document.querySelector('.services-section');
const canvasWrapper = document.getElementById('canvasWrapper');
const canvas = document.getElementById('bgCanvas');
let renderControlTrigger = null;

// Three.js variables
let renderer, scene, camera, rings = [];
let isServicesActive = false;
let rafId = null;
let initialized = false;

// Initialize Three.js only once
function initThreeJS() {
  if (renderer) return;
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  updateCameraPosition();

  renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: false,
      antialias: true,
      powerPreference: 'high-performance'
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 1);
    
  // Create rings with optimized geometry
  for(let i = 0; i < 4; i++) {
    const geometry = new THREE.TorusGeometry(6 - i * 0.75, 0.25, 32, 64);
    const mat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 1,
        thickness: 0.5,
        roughness: 0,
        metalness: 0,
        ior: 1.5,
        transparent: true,
        opacity: 0.5,
        specularIntensity: 1
    });
    
    const torus = new THREE.Mesh(geometry, mat);
    torus.rotation.x = Math.PI / 2;
    scene.add(torus);
    rings.push(torus);
  }

  // Optimized lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0);
  scene.add(ambientLight);
  
  const dl = new THREE.DirectionalLight(0xffffff, 1000);
  dl.position.set(-9, 7, 0);
  scene.add(dl);

  const dl2 = new THREE.DirectionalLight(0xffffff, 100);
  dl2.position.set(9, -4, 0);
  scene.add(dl2);

  const dl3 = new THREE.DirectionalLight(0xffffff, 100);
  dl3.position.set(8, 5, 0);
  scene.add(dl3);

  const dl4 = new THREE.DirectionalLight(0xffffff, 100);
  dl4.position.set(-9, -4, 0);
  scene.add(dl4);
}

function updateCameraPosition(){
  if(!camera) return;

  if(window.innerWidth <= 600){
    camera.position.z = 15;
  } else {
    camera.position.z = 10;
  }
}

function handleThreeJSResize(){
  if(renderer && camera){
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    updateCameraPosition();
    camera.updateProjectionMatrix();
  }
}

// Fixed ring animations with proper timing
function setupRingAnimations() {
  rings.forEach((ring, index) => {
    const direction = index % 2 === 0 ? 1 : -1;
    const rotations = [1, 2, 2, 1][index];
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".services-section",
        start: "top center",
        end: "bottom+=6500", // Extended end point to give rings space to complete animations
        scrub: 0,
        invalidateOnRefresh: true
      }
    });
    
    const standingPosition = Math.PI;
    
    // Phase 1: Rotate to standing position (longer duration for smoother animation)
    tl.to(ring.rotation, {
        x: standingPosition,
        y: direction * rotations * Math.PI,
        duration: 7, // Increased duration for smoother rotation
        ease: "none"
    }, 1);

    // Phase 2: Complete the rotation cycle
    tl.to(ring.rotation, {
        x: -standingPosition,
        y: direction * rotations * Math.PI * 2, // Complete full rotations
        duration: 7, // Balanced duration for completion
        ease: "none"
    }, 9);
  });
}

// Canvas expansion animation
gsap.fromTo(
  canvasWrapper,
  { height: "0vh" },
  {
    height: "100vh",
    ease: "none",
    scrollTrigger: {
      trigger: ".services-section",
      start: "top center",
      end: "top top",
      scrub: true,
      invalidateOnRefresh: true,
      onEnter: () => {
        if (!initialized) {
          initThreeJS();
          setupRingAnimations();
          initialized = true;
        }
      }
    }
  }
);

// Extended ScrollTrigger for rendering control
renderControlTrigger = ScrollTrigger.create({
  trigger: ".services-section",
  start: "top center",
  end: "bottom+=6000", // Match the extended end point
  onEnter: () => { 
    isServicesActive = true; 
    startRendering(); 
  },
  onEnterBack: () => { 
    isServicesActive = true; 
    startRendering(); 
  },
  onLeave: () => { 
    isServicesActive = false; 
    stopRendering(); 
  },
  onLeaveBack: () => { 
    isServicesActive = false; 
    stopRendering(); 
  }
});
  
const revealLt = gsap.timeline({
  scrollTrigger: {
    trigger: ".services-section",
    start: "top center",
    end: "bottom+=4000", // Extended to match ring animations
    scrub: 1,
    markers: false,
    invalidateOnRefresh: true
  }
});

revealLt.to("#services", { x: "0%", opacity: 1, duration: 0.05 }, 0.1)
  .to("#to", { x: "0%", opacity: 1, duration: 0.05 }, 0.1)
  .to("#fuel", { x: "0%", opacity: 1, duration: 0.05 }, 0.15)
  .to("#your", { x: "0%", opacity: 1, duration: 0.05 }, 0.15)
  .to("#growth", { x: "0%", opacity: 1, duration: 0.05 }, 0.2)
  .to("#growth", { x: "100px", opacity: 0, duration: 0.1 }, 0.3)
  .to("#to", { x: "100px", opacity: 0, duration: 0.1 }, 0.3)
  .to("#services", { x: "-100px", opacity: 0, duration: 0.1 }, 0.3)
  .to("#fuel", { x: "-100px", opacity: 0, duration: 0.1 }, 0.3)
  .to("#your", { x: "100px", opacity: 0, duration: 0.1 }, 0.3);

// Service items animation with extended scroll distance
mm.add("(min-width: 600px)", ()=>{
  const serviceTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".services-section",
      start: "top top",
      end: "+=6000", // Increased for slower, smoother service item animations
      pin: true,
      pinSpacing: true,
      anticipatePin: true,
      scrub: 1,
      markers: false,
      invalidateOnRefresh: true
    }
  });

  serviceTL.to(".service-item", {
    y: 0,
    opacity: 1,
    stagger: 0.2,
    duration: 1,
    ease: "power2.out"
  }, 1);

  return () => {
    serviceTL.scrollTrigger && serviceTL.scrollTrigger.kill();
    serviceTL.kill();
  };
});

mm.add("(max-width: 600px)", ()=>{
  const serviceTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".services-section",
      start: "top top",
      end: "+=6000", // Increased for consistency
      pin: true,
      pinSpacing: true,
      anticipatePin: true,
      scrub: 1,
      markers: false,
      invalidateOnRefresh: true
    }
  });

  const moveUp = -window.innerHeight;

  serviceTL.to(".service-item", {
    y: moveUp,
    opacity: 1,
    stagger: 0.2,
    duration: 1,
    ease: "power2.out"
  }, 1);

  return () => {
    serviceTL.scrollTrigger && serviceTL.scrollTrigger.kill();
    serviceTL.kill();
  }
});

// Rendering control functions
function startRendering() {
  if (!rafId) {
    renderLoop();
  }
}

function stopRendering() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

function renderLoop() {
  if (isServicesActive) {
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(renderLoop);
  }
}

// Clean up when leaving page
window.addEventListener('beforeunload', () => {
  if (renderer) {
    renderer.dispose();
    renderer = null;
  }
  
  rings.forEach(ring => {
    if (ring.geometry) ring.geometry.dispose();
    if (ring.material) ring.material.dispose();
  });
  
  rings = [];
});

  //============= Booking ============
  charReveal('heading-char', 'booking-heading');

  mm.add("(min-width: 990px)", ()=>{
    gsap.fromTo(".book-image",
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
  })

  mm.add("(max-width: 990px) and (min-width: 601px)", () => {
    const bookingSection = document.querySelector(".booking-section");
    const bookingContent = document.querySelector(".booking-content");
    const images = gsap.utils.toArray(".book-image");

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

    images.forEach(img => gsap.set(img, { y: () => window.innerHeight + 500, opacity: 1 }));

    const imageTriggers = images.map((img, i) => {
      const st = gsap.to(img, {
        y: 0,
        ease: "none",
        scrollTrigger: {
          start: () => bookingSection.offsetTop + i * gap(),
          end: () => bookingSection.offsetTop + i * gap() + animLen(),
          scrub: 0.5,
          invalidateOnRefresh: true
        }
      });
      return st;
    });

    return () => {
      pinTrigger.kill();
      imageTriggers.forEach(t => t.kill && t.kill());
      images.forEach(img => gsap.set(img, { clearProps: "y,opacity" }));
    };
  });

  mm.add("(max-width: 600px)", () => {
    const bookingSection = document.querySelector(".booking-section");
    const bookingContent = document.querySelector(".booking-content");
    const images = gsap.utils.toArray(".book-image");

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

    images.forEach(img => gsap.set(img, { y: () => window.innerHeight + 500, opacity: 1 }));

    const imageTriggers = images.map((img, i) => {
      const st = gsap.to(img, {
        y: 0,
        ease: "none",
        scrollTrigger: {
          start: () => bookingSection.offsetTop + i * gap(),
          end: () => bookingSection.offsetTop + i * gap() + animLen(),
          scrub: 0.5,
          invalidateOnRefresh: true
        }
      });
      return st;
    });

    return () => {
      pinTrigger.kill();
      imageTriggers.forEach(t => t.kill && t.kill());
      images.forEach(img => gsap.set(img, { clearProps: "y,opacity" }));
    };
  });

  // Audit section
  const img = document.querySelector('.circles-image');
  const auditLink = document.querySelector('.audit-link')

  auditLink.addEventListener("mousemove", (e)=>{
    const rect = auditLink.getBoundingClientRect();
    
    const relativeX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const relativeY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    
    const maxMoveX = rect.width * 0.5;
    const maxMoveY = rect.height * 0.3;
    
    const moveX = relativeX * maxMoveX;
    const moveY = relativeY * maxMoveY;

    gsap.to(img,{
      x: moveX,
      y: moveY,
      duration: 0.2,
      ease: "power2.out"
    })
  })

  auditLink.addEventListener("mouseleave", (e)=>{
    gsap.to(img,{
      x: 0,
      y: 0,
      duration: 0.2,
      ease: "power2.out"
    })
  })

  auditLink.addEventListener('mouseenter', ()=>{
    cursorDot.classList.add('work-hover')
  })

  auditLink.addEventListener('mouseleave', ()=>{
    cursorDot.classList.remove('work-hover')
  })

  // Review section
  AddSpans('review-heading','review-char');
  charReveal('review-char','review-heading')

  const reviewStrip = document.querySelector('.review-strip');
  const prevButton = document.querySelector('.prev-button');
  const nextButton = document.querySelector('.next-button');

  if(!reviewStrip.dataset.cloned){
    const reviewItems = Array.from(reviewStrip.children);

    reviewItems.forEach((item) =>{
      reviewStrip.appendChild(item.cloneNode(true));
    });
    for(let i=reviewItems.length - 1; i>=0; i--){
      reviewStrip.insertBefore(reviewItems[i].cloneNode(true), reviewStrip.firstChild);
    }
    reviewStrip.dataset.cloned = '1';
  }

  let reviewItems = Array.from(document.querySelectorAll('.review-item'))
  const itemWidth = reviewItems[0].offsetWidth + 8;
  let currentIndex = reviewItems.length/3;
  let draggable;

  const containerWidth = reviewStrip.parentElement.offsetWidth;
  const offset = (containerWidth - itemWidth) / 2;
  const startPosition = currentIndex * itemWidth - offset;
  let startX=0;

  gsap.set(reviewStrip, {x: -startPosition})

  function updateActiveCard(centerIndex){
    const old = reviewStrip.querySelector('.review-item.active');
    const current = reviewItems[centerIndex];

    if (old && old !== current) old.classList.remove('active');
    current.classList.add('active');
  }

  function initDraggable(){
    draggable = Draggable.create(reviewStrip, {
      type: "x",
      edgeResistance: 0.8,
      inertia: true,
      onPress(){
        startX = gsap.getProperty(reviewStrip, 'x');
      },
      onDragEnd: snapWithThreshold,
      onThrowComplete: snapWithThreshold
    })[0];
  }

  function snapWithThreshold(){
    const endX = gsap.getProperty(reviewStrip, 'x');
    const delta = endX - startX;
    const threshold = containerWidth/4
    let newIndex = currentIndex;

    if(delta < -threshold){
      newIndex = currentIndex+1;
    }
    else if(delta > threshold){
      newIndex = currentIndex-1;
    }

    goToReview(newIndex);
  }
    
  function goToReview(index) {
    const itemsPerSet = reviewItems.length / 3;
    if (index < 1) {
      currentIndex = 2 * itemsPerSet - 1;
      const targetPosition = currentIndex * itemWidth - offset;
      gsap.set(reviewStrip, { x: -targetPosition });
      
      index = currentIndex - 1;
    } 
    else if (index >= reviewItems.length-1) {
      currentIndex = itemsPerSet;
      const targetPosition = currentIndex * itemWidth - offset;
      gsap.set(reviewStrip, { x: -targetPosition });
      
      index = currentIndex + 1;
    }
    
    currentIndex = index;
    
    const targetPosition = currentIndex * itemWidth - offset;
    
    gsap.to(reviewStrip, {
      x: -targetPosition,
      duration: 0.7,
      ease: "power2.out",
      onUpdate: updateActiveCard(currentIndex),
      onComplete: () => {
        if (currentIndex < itemsPerSet) {
          currentIndex += itemsPerSet;
          const newPosition = currentIndex * itemWidth - offset;
          gsap.set(reviewStrip, { x: -newPosition });
        } 
        else if (currentIndex >= 2 * itemsPerSet) {
          currentIndex -= itemsPerSet;
          const newPosition = currentIndex * itemWidth - offset;
          gsap.set(reviewStrip, { x: -newPosition });
        }
        updateActiveCard(currentIndex);
      }
    });
  }
    
  // Event listeners for buttons
  prevButton.addEventListener('click', () => goToReview(currentIndex - 1));
  nextButton.addEventListener('click', () => goToReview(currentIndex + 1));
  
  // Initialize draggable after slight delay to ensure dimensions are correct
  setTimeout(() => {
    initDraggable();
    updateActiveCard(currentIndex); // Set initial opacity
  }, 100);

  reviewStrip.addEventListener('mouseenter', ()=>{
    cursorDot.classList.add('drag-hover')
  })

  reviewStrip.addEventListener('mouseleave', ()=>{
    cursorDot.classList.remove('drag-hover')
  })

  // Footer
  const track = document.querySelector('.scroll-track');
  const inqLink = document.querySelector('.footer-title-wrapper');

  inqLink.addEventListener('mouseenter', ()=>{
    cursorDot.classList.add('work-hover');
  })

  inqLink.addEventListener('mouseleave', ()=>{
    cursorDot.classList.remove('work-hover');
  })
    
  const animation = track.animate(
    [
      { transform: 'translateX(0%)' },
      { transform: 'translateX(-50.3%)' }
    ],
    {
      duration: 15000,
      iterations: Infinity,
      easing: 'linear'
    }
  );

  // Track scroll direction
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    animation.playbackRate = (currentScrollY > lastScrollY) ? 1 : -1;
    lastScrollY = currentScrollY;
  });

  // Restore scroll position after animations are set up
  setTimeout(() => {
    restoreScrollPosition();
  }, 100);
}

// Improved resize handler with debouncing
const debouncedResize = debounce(() => {
  // Handle Three.js resize separately to avoid full reinitialization
  if (typeof handleThreeJSResize === 'function') {
    handleThreeJSResize();
  }
  
  // Only reinitialize animations if screen size category changes
  const currentBreakpoint = window.innerWidth <= 600 ? 'mobile' : 
                           window.innerWidth <= 990 ? 'tablet' : 'desktop';
  
  if (!window.lastBreakpoint) {
    window.lastBreakpoint = currentBreakpoint;
  }
  
  // Only reinitialize if breakpoint actually changed
  if (window.lastBreakpoint !== currentBreakpoint) {
    window.lastBreakpoint = currentBreakpoint;
    initAnimations();
  }
  
  // Gentle refresh for responsive elements
  ScrollTrigger.refresh();
}, 250);

// Initialize animations on load
window.addEventListener('load', () => {
  initAnimations();
  ScrollTrigger.refresh();
});

// Use debounced resize handler
window.addEventListener('resize', debouncedResize);

// Prevent scroll restoration on page reload
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Handle visibility change to pause/resume animations when tab is hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause expensive operations when tab is hidden
    gsap.globalTimeline.pause();
  } else {
    // Resume when tab becomes visible
    gsap.globalTimeline.resume();
  }
});