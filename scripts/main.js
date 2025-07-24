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
      mouseX = e.clientX - 17;
      mouseY = e.clientY - 10;

      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`
      mouseTick=false;
    });
  }
  mouseTick=true;
})


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
const aboutText = document.querySelector('.about');
const text = aboutText.textContent;

aboutText.innerHTML = '';

[...text].forEach((char) =>{
  const span = document.createElement('span');
  span.textContent = char;
  span.classList.add('about-char');
  aboutText.appendChild(span);
})

// works - container
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



////////   GSAP //////////




gsap.registerPlugin(ScrollTrigger);

//about-info
gsap.to('.about-char', {
  opacity: 1,
  stagger:{
    each: 0.3,
    from: 'start',
    ease: 'power1.inout'
  },
  scrollTrigger:{
    trigger: '.about',
    start: 'top 80%',
    end: 'bottom 65%',
    scrub: true,
    markers: false,
  }
});

//video scale
gsap.to('.video-container', {
  scale: 1.1125,
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


const hero = document.querySelector('.works-container');
const wrapper = document.querySelector('.scroll-wrapper');
const workList = document.querySelector('.work-item-list');
const itemCount = document.querySelectorAll('.work-item').length;

const totalScroll = wrapper.scrollWidth - window.innerWidth;

console.log(totalScroll)

gsap.timeline({
  scrollTrigger:{
    trigger: '.works-section',
    start: 'top top',
    end: () => `+=${totalScroll}`,
    scrub: true,
    pin: true,
    anticipatePin: 1
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