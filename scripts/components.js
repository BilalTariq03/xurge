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
        <a href="index.html" class="logo-container">
          <img class="logo" src="images/SVG/XurgeLogo.svg" alt="Xurge-logo">
        </a>
        <div >
          <ul class="menu-items" id="nav-menu">

            <li class="mobile-only">
              <a href="index.html" class="item active">
                <span class="text-wrap">
                  <span class="top text">Home</span>
                  <span class="bottom text">Home</span>
                </span>
              
            </a></li>

            <li><a href="work.html" class="item">
              <span class="text-wrap">
                <span class="top text">Work</span>
                <span class="bottom text">Work</span>
              </span>
              
            </a></li>

            <li><a href="#" class="item">
              <span class="text-wrap">
                <span class="top text">Services</span>
                <span class="bottom text">Services</span>
              </span>
              
            </a></li>

            <li><a href="#" class="item"> 
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
              <button class="talk-button mobile-button">
                Lets Talk <i class="fa-solid fa-arrow-up button-logo"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      <div class="right-items">
        <i class="fa-solid fa-bars menu-button"></i>
        <div class="button-holder">
          <a class="talk-button btn-main">
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
      <a class="talk-button-float talk-button">
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
        <a class="footer-title-wrapper" href="#" target="_blank">
          <div class="scroll-track">
            <span>Let's work together on what matters to you.</span>
            <span class="second" aria-hidden="true">Let's work together on what matters to you.</span>
          </div>
        </a>
      </div>
      <div class="mobile-only">
        <a href="#" target="_blank" class="footer-button">
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
                  <img src="./images/SVG/Xurge Primary.svg">
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
              <a class="footer-link" href="#">
                <div>Work</div>
              </a>
              <a class="footer-link" href="#">
                <div>Services</div>
              </a>
              <a class="footer-link" href="#">
                <div>Studio</div>
              </a>
              <a class="footer-link" href="#">
                <div>Insights</div>
              </a>
              <a class="footer-link" href="#">
                <div>FAQs</div>
              </a>
              <a class="footer-link" href="#">
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
              <a href="#" target="_blank" class="book-call-button">
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