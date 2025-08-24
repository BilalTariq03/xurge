class ComponentLoader{
  constructor(){
    this.components = {
      navbar: this.getNavbarHTML(),
      cursorBall: this.getCursorBallHTML()
    };
  }

  getNavbarHTML(){
    return `
      <div class="left-items">
        <a class="logo-container" href="index.html">
          <img class="logo" src="images/SVG/XurgeLogo.svg">
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
      activeMenuItem = null,
      loadNavbar = true,
      loadCursor = true
    } = options;

    if(loadNavbar){
      this.loadNavbar(navbarContainer, activeMenuItem);

      setTimeout(()=>{ this.initializeNavbarEvents(), 100});
    }

    if(loadCursor){
      this.loadComponent('cursorBall', cursorContainer);
    }
  }
}

window.ComponentLoader = ComponentLoader;

// Auto-initialize if containers exist (for convenience)
document.addEventListener('DOMContentLoaded', function() {
// Only auto-initialize if specific containers exist
const navContainer = document.getElementById('navbar-container');
const cursorContainer = document.getElementById('cursor-container');

  if (navContainer || cursorContainer) {
      const loader = new ComponentLoader();
      loader.initializePage({
          loadNavbar: !!navContainer,
          loadCursor: !!cursorContainer
      });
  }
});