class ComponentLoader{
  constructor(){
    this.components = {
      navbar: this.getNavbarHTML(),
      cursorBall: this.getCursorBallHTML(),
      floatingButton : this.getFloatingButtonHTML(),
      footer: this.getFooterHTML()
    };
  }

  getNavbarHTML(){
    return `
      <div class="left-items">
        <a href="/" class="logo-container">
          <svg class="logo" id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1232.89 264.54">
            <defs>
              <style>
                .cls-1 {
                  fill: currentColor;
                }
              </style>
            </defs>
            <g id="Layer_1-2" data-name="Layer 1">
              <path class="cls-1" d="M584.26,96.44v61.23c0,42.63-23.58,63.34-78.02,63.34-32.66,0-54.15-7.34-66.15-22.4,8.36-8.34,16.68-16.64,23.11-23.06,4.67,10.6,16.07,18.97,43.04,18.97,41.32,0,46.11-19.82,46.11-36.84v-61.23h31.92ZM428.29,96.44l31.85,31.1v-31.1h-31.85Z"/>
              <path class="cls-1" d="M761.67,141.52c0-27.37-19.32-45.07-47.52-45.07h-97.53v122.8h31.91v-32.81h51.43l20.04,32.81h37.59l-22.88-36.49c16.68-6.49,26.96-21.24,26.96-41.24ZM705.29,159.94h-56.75v-37.02h56.75c9.57,0,24.47,0,24.47,18.59s-14.9,18.43-24.47,18.43Z"/>
              <path class="cls-1" d="M868.52,173.98h46.28c-.71,9.3-13.12,22.63-43.98,22.63-41.32,0-47.17-23.16-47.17-38.07s5.67-37.37,47.17-37.37c33.69,0,42.2,13.86,43.98,23.16h32.45c-1.95-30.53-26.78-49.65-76.43-49.65s-79.09,22.46-79.09,63.16,28.02,63.16,73.77,63.16c26.42,0,45.04-8.42,56.74-21.05l1.42,19.3h23.58v-65.79h-78.73v20.53Z"/>
              <polygon class="cls-1" points="1110.87 121.52 1110.87 96.44 979.65 96.44 979.65 219.24 1110.87 219.24 1110.87 194.16 1011.57 194.16 1011.57 169.24 1110.87 169.24 1110.87 146.44 1011.57 146.44 1011.57 121.52 1110.87 121.52"/>
              <g>
                <path class="cls-1" d="M356.71,97.55c-.15-.15-.29-.29-.43-.43h0c.14.14.28.28.42.43Z"/>
                <path class="cls-1" d="M356.71,97.55c-.15-.15-.29-.29-.43-.43h0c.14.14.28.28.42.43Z"/>
                <path class="cls-1" d="M242.63,190.92c-23.24,23.14-50.67,50.55-73.78,73.62h35.17c14.9-14.88,33.94-33.86,48.92-48.81h62.76c5.31-5.3,19.74-19.67,24.85-24.8h-97.92Z"/>
                <path class="cls-1" d="M428.22,133.8l-36.77-36.68h-35.16c.14.14.28.28.42.43.15.15.3.3.46.46s.31.31.48.48c.16.16.34.32.51.5.16.17.34.34.53.53.17.18.36.36.54.54l.57.57c.19.19.39.38.58.58l1.23,1.23c.43.41.86.85,1.3,1.3l.67.67c1.14,1.13,2.35,2.33,3.59,3.59.25.25.51.5.75.75.51.49,1.02,1.01,1.54,1.53.26.26.53.53.79.79,11.04,11.01,24.44,24.38,30.34,30.28h-177.41c-28.14,28.09-70.76,70.61-98.55,98.34h-34.26c38.29-38.21,86.75-86.56,124.84-124.57l-66.72-66.58H48.72l24.85,24.8h64.62c10.23,10.21,31.71,31.65,41.82,41.73-47.57,47.48-102.08,101.87-149.74,149.42h104.67l98.56-98.34h165.6c-14.47,14.43-35.09,35-49.52,49.4l.16.16h34.85s24.29-24.24,44.54-44.44c6.96-6.95,13.45-13.42,18.31-18.26v-.04l-19.22-19.18Z"/>
                <path class="cls-1" d="M305.74,24.8h201.32l24.85-24.8h-236.48c-20.14,20.14-43.22,43.13-63.35,63.22L168.72,0H0l24.85,24.8h133.56l108.39,108.08c11.66-11.63,47.42-47.31,59.67-59.54h131.86l24.86-24.8h-167.03c-12.49,12.46-36.92,36.83-49.4,49.29l-17.12-17.08h.04s41.63-41.54,56.06-55.94Z"/>
              </g>
              <path class="cls-1" d="M356.37,93l-.42-.42c.13.13.28.28.42.42h0Z"/>
              <path class="cls-1" d="M356.37,93l-.42-.42c.13.13.28.28.42.42h0Z"/>
              <path class="cls-1" d="M1156.17,124.33v-19.66h-12.27v-7.76h33.69v7.76h-12.22v19.66h-9.2Z"/>
              <path class="cls-1" d="M1190.91,124.33v-27.42h11.6l9.4,16.8,9.44-16.8h11.56v27.42h-9.16v-14.8l-8.74,14.8h-6.15l-8.74-14.8v14.8h-9.2Z"/>
            </g>
          </svg>
        </a>
        <div >
          <ul class="menu-items" id="nav-menu">

            <li class="mobile-only">
              <a href="/" class="item active">
                <span class="text-wrap">
                  <span class="top text">Home</span>
                  <span class="bottom text">Home</span>
                </span>
              
            </a></li>

            <li><a href="/work" class="item">
              <span class="text-wrap">
                <span class="top text">Work</span>
                <span class="bottom text">Work</span>
              </span>
              
            </a></li>

            <li><a href="/services" class="item">
              <span class="text-wrap">
                <span class="top text">Services</span>
                <span class="bottom text">Services</span>
              </span>
              
            </a></li>

            <li><a href="/about" class="item"> 
              <span class="text-wrap">
                <span class="top text">Studio</span>
                <span class="bottom text">Studio</span>  
              </span>
              
            </a></li>

            <li><a href="#" class="item"> 
              <span class="text-wrap">
                <span class="top text">Insights</span>
                <span class="bottom text">Insights</span> 
              </span>
              
            </a></li>

            <li>
              <button class="mobile-only mobile-button">
                Lets Talk <i class="fa-solid fa-arrow-up button-logo"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="right-items">
        <i class="fa-solid fa-bars menu-button mobile-only"></i>
        <div class="button-holder">
          <a href="/contact" class="talk-button btn-main">
            <div class="button-content">
              <div class="button-text">
                Lets Talk
              </div>
              <span class="button-logo-span">
                <i class="fa-solid fa-arrow-up button-logo button-logo-1"></i>
                <i class="fa-solid fa-arrow-up button-logo button-logo-2"></i>
              </span>
            </div>
          </a>
        </div>
        
      </div>
    `;
  }

  getCursorBallHTML(){
    return `
      <i class="fa-solid fa-play video-icon"></i>
      <i class="fa-solid fa-arrow-up arrow-icon"></i>
      <p class="drag-hover">DRAG</p>
    `;
  }

  getFloatingButtonHTML(){
    return `
      <a href="/contact" class="talk-button-float talk-button">
        <div class="button-content">
          <div class="button-text">
            Lets Talk
          </div>
          <span class="button-logo-span">
            <i class="fa-solid fa-arrow-up button-logo button-logo-1"></i>
            <i class="fa-solid fa-arrow-up button-logo button-logo-2"></i>
          </span>
        </div>
        
      </a>
    `
  }

  getFooterHTML(){
    return `
        <div class="footer-title-container">
        <a class="footer-title-wrapper" href="/contact">
          <div class="scroll-track">
            <span>Let's work together on what matters to you.</span>
            <span class="second" aria-hidden="true">Let's work together on what matters to you.</span>
          </div>
        </a>
      </div>
      <div class="mobile-only">
        <a href="/contact" target="_blank" class="footer-button">
          <div class="button-content">
            Get in touch
            <i class="fa-solid fa-arrow-up button-logo"></i>
          </div>
        </a>
      </div>
      <div class="padding-inline">
        <div class="footer-grid">
          <div class="footer-left">
            <div class="footer-left-holder">
              <div class="footer-headline-wrap"></div>
              <a aria-label="Go to home page" class="logo-link" href="/">
                <div class="logo">
                  <img src="/images/SVG/XurgePrimary.svg">
                </div>
              </a>
            </div>
          </div>

          <div class="footer-links">
            <div class="footer-headline-wrap">
              <div class="footer-menu-heading">
                Menu
              </div>
            </div>
            <div class="footer-link-wrap">
              <a class="footer-link" href="/">
                <div>Home</div>
              </a>
              <a class="footer-link" href="/work">
                <div>Work</div>
              </a>
              <a class="footer-link" href="/services">
                <div>Services</div>
              </a>
              <a class="footer-link" href="/about">
                <div>Studio</div>
              </a>
              <a class="footer-link" href="#">
                <div>Insights</div>
              </a>
              <a class="footer-link" href="#">
                <div>FAQs</div>
              </a>
              <a class="footer-link" href="/contact">
                <div>Contact</div>
              </a>
            </div>
          </div>

          <div class="footer-links">
            <div class="footer-headline-wrap">
              <div class="footer-menu-heading">
                Socials
              </div>
            </div>
            <div class="footer-link-wrap">
              <a class="footer-link" href="#">
                <div>LinkedIn</div>
              </a>
              <a class="footer-link" href="#">
                <div>Instagram</div>
              </a>
            </div>
          </div>

          <div class="footer-links call">
            <div class="footer-headline-wrap">
              <div class="footer-menu-heading">
                Business Enquiries
              </div>
            </div>
            <div class="footer-link-wrap">
              <a class="footer-link" href="mailto:info@xurgestudio.co">
                <div>info@xurgestudio.co</div>
              </a>
              <a class="footer-link" href="tel:+923055150456 ">
                <div>+92 305 5150456</div>
              </a>
            </div>
            <div class="footer-call">
              <div class="footer-call-heading"> 
                <h2 class="title">Book a Call</h2>
                <p>A 30-min discovery call to see how we can help</p>
              </div>
              <a href="/contact" target="_blank" class="book-call-button">
                <div class="button-wrap">
                  <div class="user-container">
                    <img src="https://picsum.photos/50">
                    <div class="user-info">
                      <div class="name-wrapper">
                        <span>Bashaar Khan</span>
                        <span>Bashaar Khan</span>
                      </div>
                      <div class="designation-wrapper">
                        <span>Founder</span>
                        <span>Founder</span>
                      </div>
                    </div>
                  </div>
                  
                  
                  <div class="booking-button">
                    <span class="booking-link-span">
                      <i class="fa-solid fa-arrow-up booking-link-icon"></i>
                      <i class="fa-solid fa-arrow-up booking-link-icon booking-link-icon2"></i>
                    </span> 
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div class="copyright-container">
          <div class="left-section">
            <p>© 2025 XURGE</p>
            <p>|</p>
            <p>Islamabad</p>  
          </div>

          <div class="right-section">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    `
  }

  loadComponent(componentName, containerId){
    const container =document.getElementById(containerId);
    if(!container){
      console.error(`Container with id ${containerId} not found`);
      return false;
    }

    if(!this.components[componentName]){
      console.error(`Component ${componentName} not found`);
      return false;
    }

    container.innerHTML = this.components[componentName];
    return true;
  }

  loadNavbar(containerId, activeItem = null){
    const success = this.loadComponent('navbar', containerId);

    if(success && activeItem){
      setTimeout(()=>{
        this.setActiveMenu(activeItem);
      }, 0);
    }
    return success;
  }

  setActiveMenu(){
    document.querySelectorAll('.menu-items .item').forEach(item => {
      item.classList.remove('active');
    });

    document.querySelectorAll('.menu-items .item').forEach(item => {
      const textElement = item.querySelector('.top.text');
      if (textElement && textElement.textContent.trim() === activeItemText) {
          item.classList.add('active');
      }
    });
  }

  initializeNavbarEvents() {
    const hamburger = document.querySelector('.menu-button')
    const transitionEl = document.getElementById("page-transition");

    hamburger.addEventListener('click',()=>{
      const navMenu = document.getElementById('nav-menu')
      navMenu.classList.toggle('show');
      
      hamburger.classList.toggle('fa-bars');
      hamburger.classList.toggle('fa-xmark');
    })


    document.querySelectorAll('.nav-bar a').forEach((item) => {
      item.addEventListener('click', function(e){
        const target = this.getAttribute('href');

        // If it's a normal link
        if(target && target !== "#"){
          e.preventDefault();

          transitionEl.classList.add("active");

          setTimeout(() => {
            window.location.href = target;
          }, 600); // match CSS transition duration
        }
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
  }

  initializePage(options = {}){
    const {
      navbarContainer = 'navbar-container',
      cursorContainer = 'cursor-container',
      buttonContainer = 'button-container',
      footerContainer = 'footer-container',
      activeMenuItem = null,
      loadNavbar = true,
      loadCursor = true,
      loadButton = true,
      loadFooter = true,
    } = options;

    if(loadNavbar){
      this.loadNavbar(navbarContainer, activeMenuItem);

      setTimeout(()=>{ this.initializeNavbarEvents(), 100});
    }

    if(loadCursor){
      this.loadComponent('cursorBall', cursorContainer);
    }

    if(loadButton){
      this.loadComponent('floatingButton', buttonContainer);
    }

    if(loadFooter){
      this.loadComponent('footer', footerContainer);
    }
  }
}

window.ComponentLoader = ComponentLoader;

// Auto-initialize if containers exist (for convenience)
document.addEventListener('DOMContentLoaded', function() {
// Only auto-initialize if specific containers exist
const navContainer = document.getElementById('navbar-container');
const cursorContainer = document.getElementById('cursor-container');
const buttonContainer = document.getElementById('button-container');
const footerContainer = document.getElementById('footer-container')

  if (navContainer || cursorContainer) {
      const loader = new ComponentLoader();
      loader.initializePage({
          loadNavbar: !!navContainer,
          loadCursor: !!cursorContainer,
          loadButton: !!buttonContainer,
          loadFooter: !!footerContainer
      });
  }
});