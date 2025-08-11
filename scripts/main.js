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

      const mouseX = e.clientX-17;
      const mouseY = e.clientY-10;

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

const videoContainer = document.querySelector('.video-container');
const video = document.getElementById('bg-video');
const modal = document.querySelector('.video-modal');
const fullVideo = document.querySelector('.full-video');

const startTime = 4;
const endTime = 36;

video.addEventListener('loadedmetadata', ()=>{
  video.currentTime = startTime;
});

video.addEventListener('timeupdate', ()=>{
  if(video.currentTime >= endTime){
    video.currentTime=startTime;
  }
});

video.addEventListener('click', ()=>{
  modal.style.display = 'flex';
  video.pause();
  fullVideo.play();

});

modal.addEventListener('click', (e)=>{
  if(e.target === modal){
    pauseVideo();
  }
});

function pauseVideo(){
  fullVideo.pause();
  fullVideo.currentTime = 0;
  modal.style.display = 'none';
  video.play();
}


videoContainer.addEventListener('mouseenter', ()=>{
  cursorDot.classList.add('video-hover');
});

videoContainer.addEventListener('mouseleave', ()=>{
  cursorDot.classList.remove('video-hover')
});


const closeButton = document.querySelector('.close-modal');

closeButton.addEventListener('click', ()=>{
  pauseVideo();
})


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




////////   GSAP //////////

gsap.registerPlugin(ScrollTrigger);
const mm = gsap.matchMedia();
window.addEventListener("load", () => ScrollTrigger.refresh());

function charReveal(className, triggerName, markers= false){
  gsap.to(`.${className}`, {
    opacity: 1,
    stagger:{
      each: 0.3,
      from: 'start',
      ease: 'power1.inout'
    },
    scrollTrigger:{
      trigger: `.${triggerName}`,
      start: 'top 80%',
      end: 'bottom 65%',
      scrub: true,
      markers,
    }
  });
}
//about-info
charReveal('about-char', 'about');

//video scale
gsap.to('.video-container', {
  scale: 1.12,
  ease: "power2.out",
  scrollTrigger:{
    trigger: ".video-container",
    start: "top center",
    end: "top top",
    scrub: true
  }
});


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
        start: "top 90%",
        toggleActions: "play none none none"
      },
      snap: { innerText: 1},
      onUpdate: function (){
        const value = Math.round(counter.innerText);
        counter.textContent = value + (counter.textContent.includes("%")?"%":"+")
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
  camera.position.z = 10;

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

// Optimized ring animations
function setupRingAnimations() {
  rings.forEach((ring, index) => {
    const direction = index % 2 === 0 ? 1 : -1;
    const rotations = [1, 2, 2, 1][index];
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".services-section",
        start: "top center",
        end: "bottom top",
        scrub: 0,
        // markers: true
      }
    });
    const standingPosition = Math.PI;
    
    tl.to(ring.rotation, {
        x: standingPosition,
        y: direction * rotations * Math.PI,
        duration: 10
    }, 1);

    tl.to(ring.rotation, {
        x: -standingPosition,
        y: direction * rotations * Math.PI * 0,
        duration: 5
    }, 13);
    
    // tl.to(ring.rotation, {
    //     x: standingPosition,
    //     y: direction * rotations * Math.PI,
    //     duration: 20
    // }, 65);
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
      markers: false,
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

// FIX: Separate ScrollTrigger to control rendering state
// This ensures rings keep spinning throughout entire services section
renderControlTrigger =  ScrollTrigger.create({
  trigger: ".services-section",
  start: "top center",
  end: "bottom top",
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

mm.add("(min-width: 990px)", ()=>{
  
 const revealLt = gsap.timeline({
    scrollTrigger: {
      trigger: ".services-section",
      start: "top center",
      end: "bottom top",
      scrub: 1,
      markers: false,
      invalidateOnRefresh: true
    }
  });

  revealLt.to("#fuel", { x: "0%", opacity: 1, duration: 0.1 }, 0.1)
    .to("#your", { x: "0%", opacity: 1, duration: 0.1 }, 0.1)
    .to("#services", { x: "0%", opacity: 1, duration: 0.1 }, 0.2)
    .to("#to", { x: "0%", opacity: 1, duration: 0.1 }, 0.2)
    .to("#growth", { x: "0%", opacity: 1, duration: 0.1 }, 0.3)
    .to("#growth", { x: "500px", opacity: 0, duration: 0.1 }, 0.6)
    .to("#to", { x: "500px", opacity: 0, duration: 0.1 }, 0.65)
    .to("#services", { x: "-500px", opacity: 0, duration: 0.1 }, 0.65)
    .to("#fuel", { x: "-500px", opacity: 0, duration: 0.1 }, 0.7)
    .to("#your", { x: "500px", opacity: 0, duration: 0.1 }, 0.7);

  
    // Service items animation
    const serviceTL = gsap.timeline({
      scrollTrigger: {
        trigger: ".services-section",
        start: "top top",
        end: "+=5000",
        pin: true,
        pinSpacing: false,
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


    return ()=>{
      
      if(revealLt){
        revealLt.scrollTrigger && revealLt.scrollTrigger.kill();
        revealLt.kill()
      }
      if(serviceTL){
        serviceTL.scrollTrigger && serviceTL.scrollTrigger.kill();
        serviceTL.kill();
      }
    }
})
  // Text animations
mm.add("(max-width: 990px)", ()=>{
  const mobilePin = ScrollTrigger.create({
    trigger: ".services-section",
    start: "top top",
    end: "+=5000",
    pin: true,
    pinSpacing: false,
    // markers: true
  });

  gsap.set(".service-item", { clearProps: "transform, opacity" });

  return () => {
    mobilePin && mobilePin.kill();
  }
});
    // For mobile: pin service container after canvas expansion
    


// Rendering control
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

// Handle window resize
window.addEventListener('resize', () => {
  if (renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  ScrollTrigger.refresh();

  if (renderControlTrigger && renderControlTrigger.isActive) {
    isServicesActive = true;
    startRendering();
  }
});

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
charReveal('heading-char', 'booking-heading', );

mm.add("(min-width: 990px)", ()=>{
  gsap.fromTo(".book-image",
    {y:800},
    {
      y:0,
      stagger:0.2,
      ease:'none',
      scrollTrigger:{
        trigger:".booking-section",
        start:"top top+=120",
        end: "top top+=10",
        scrub: 1,
        markers: false
      }
    }
  );
})

mm.add("(max-width: 990px)", () => {
  const bookingSection = document.querySelector(".booking-section");
  const bookingContent = document.querySelector(".booking-content");
  const images = gsap.utils.toArray(".book-image");

  const gap = Math.round(window.innerHeight * 0.55);
  const animLen = Math.round(window.innerHeight * 1);

  const totalDuration = (images.length - 3) * gap + animLen + window.innerHeight;
  ScrollTrigger.create({
    trigger: bookingSection,
    start: "top top",
    end: () => `+=${totalDuration}`,
    pin: bookingContent,
    pinSpacing: false,
    invalidateOnRefresh: true,
    // markers: true
  });

  images.forEach(img => gsap.set(img, { y: window.innerHeight+500, opacity: 1 }));

  images.forEach((img, i) => {
    gsap.to(img, {
      y: 0,
      ease: "none",
      scrollTrigger: {
        start: () => bookingSection.offsetTop + i * gap,
        end: () => bookingSection.offsetTop + i * gap + animLen,
        scrub: 0.5,
        invalidateOnRefresh: true,
        // markers: true
      }
    });
  });
});






// Audit
const img = document.querySelector('.circles-image');
const auditLink = document.querySelector('.audit-link')

auditLink.addEventListener("mousemove", (e)=>{
  gsap.to(img,{
    x: e.clientX-750,
    y: e.clientY-300,
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

let reviewItems = Array.from(reviewStrip.children);
const itemWidth = reviewItems[0].offsetWidth + 8;

reviewItems.forEach((item) =>{
  reviewStrip.appendChild(item.cloneNode(true));
});
for(let i=reviewItems.length - 1; i>=0; i--){
  reviewStrip.insertBefore(reviewItems[i].cloneNode(true), reviewStrip.firstChild);
}

reviewItems = Array.from(document.querySelectorAll('.review-item'))
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
  
  // Handle window resize
  window.addEventListener('resize', () => {
    // Update draggable bounds
    const containerWidth = reviewStrip.parentElement.offsetWidth;
    const offset = (containerWidth - itemWidth) / 2;
    const startPosition = currentIndex * itemWidth - offset;
    gsap.set(reviewStrip, {x: -startPosition})
    // Update opacity
    updateActiveCard(currentIndex);
  });


reviewStrip.addEventListener('mouseenter', ()=>{
  cursorDot.classList.add('drag-hover')
})

reviewStrip.addEventListener('mouseleave', ()=>{
  cursorDot.classList.remove('drag-hover')
})


// Footer

const track = document.querySelector('.scroll-track');
const inqLink =  document.querySelector('.footer-title-wrapper');

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

