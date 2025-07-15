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