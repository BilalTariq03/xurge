const cursorDot = document.querySelector('.cursor-dot')


document.addEventListener('mousemove', (e)=>{
  mouseX = e.clientX - 17;
  mouseY = e.clientY - 10;

  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`
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

const maxScale = 1.111;
const scaleTriggerStart = window.innerHeight / 1.3; // Start scaling ~bottom of screen
const scaleTriggerEnd = 0; // Fully scaled when top of container reaches top of screen

let lastScrollY =window.scrollY
let lastScale = 1;

window.addEventListener('scroll', () => {
  const rect = videoContainer.getBoundingClientRect();
  const currentScrollY = window.scrollY;
  const scrollingUp = currentScrollY < lastScrollY;
  const scrollProgress = (scaleTriggerStart - rect.top) / (scaleTriggerStart - scaleTriggerEnd);
  const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);
  const scale = 1 + (maxScale - 1) * clampedProgress;

  // Apply only if less than max
  if (clampedProgress < 1) {
    videoContainer.style.transform = ` scale(${scale})`;
    lastScale = scale;
  } else {
    // Lock at max scale
    videoContainer.style.transform = ` scale(${maxScale})`;
    lastScale = maxScale;
  }

  // Handle scroll-up shrink
  if (scrollingUp && rect.bottom < 0) {
    video.style.transform = `translate(-50%, -50%) scale(1)`;
    lastScale = 1;
  }

  lastScrollY = currentScrollY;
});



const closeButton = document.querySelector('.close-modal');

closeButton.addEventListener('click', ()=>{
  pauseVideo();
})



// brand logos

const columns = document.querySelectorAll('.logo-column');
const logoHeight = 30;
let delays = 0;

columns.forEach((column, index)=>{
  const logos = column.querySelectorAll('.logo');

  logos.forEach(logo => {
    const clone = logo.cloneNode(true);
    column.append(clone);
  });
});