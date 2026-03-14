import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { AnimationBase } from '../core/base.js';

export class ServicesAnimation extends AnimationBase {
  constructor() {
    super();
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.rings = [];
    this.isServicesActive = false;
    this.rafId = null;
    this.initialized = false;
  }

  init() {
    this.setupCanvasExpansion();
    this.setupRingAnimations()
    this.setupTextReveal();
    this.setupServiceItems();
    this.setupRenderControl();
  }

  setupCanvasExpansion() {
    const canvasWrapper = document.getElementById('canvasWrapper');
    
    const trigger = gsap.fromTo(
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
            if (!this.initialized) {
              this.initThreeJS();
              this.setupRingAnimations();
              this.initialized = true;
            }
          }
        }
      }
    );

    this.registerTrigger(trigger.scrollTrigger);
  }

  initThreeJS() {
    if (this.renderer) return;
    
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.updateCameraPosition();

    this.renderer = new THREE.WebGLRenderer({ 
      canvas: document.getElementById('bgCanvas'), 
      alpha: false,
      antialias: true,
      powerPreference: 'high-performance'
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 2.5;
    
    // Create rings
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
        specularIntensity: 10,
        // emissive: new THREE.Color(0xffffff),
        // emissiveIntensity: 0.15
      });
      
      const torus = new THREE.Mesh(geometry, mat);
      torus.rotation.x = Math.PI / 2;
      this.scene.add(torus);
      this.rings.push(torus);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0);
    this.scene.add(ambientLight);
    
    const dl = new THREE.DirectionalLight(0xffffff, 1000);
    dl.position.set(-9, 7, 0);
    this.scene.add(dl);

    const dl2 = new THREE.DirectionalLight(0xffffff, 100);
    dl2.position.set(9, -4, 0);
    this.scene.add(dl2);

    const dl3 = new THREE.DirectionalLight(0xffffff, 100);
    dl3.position.set(8, 5, 0);
    this.scene.add(dl3);

    const dl4 = new THREE.DirectionalLight(0xffffff, 100);
    dl4.position.set(-9, -4, 0);
    this.scene.add(dl4);
  }

  updateCameraPosition() {
    if (!this.camera) return;

    if (window.innerWidth <= 600) {
      this.camera.position.z = 15;
    } else {
      this.camera.position.z = 10;
    }
  }

  setupRingAnimations() {
    this.rings.forEach((ring, index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      const rotations = [1, 2, 2, 1][index];
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".services-section",
          start: "top center",
          end: "bottom+=6500",
          scrub: 0,
          invalidateOnRefresh: true,
          // markers: true
        }
      });
      
      const standingPosition = Math.PI;
      
      tl.to(ring.rotation, {
        x: standingPosition,
        y: direction * rotations * Math.PI,
        duration: 7,
        ease: "none"
      }, 1);

      tl.to(ring.rotation, {
        x: -standingPosition,
        y: direction * rotations * Math.PI * 2,
        duration: 7,
        ease: "none"
      }, 8);
    });
  }

  setupTextReveal() {
    const revealLt = gsap.timeline({
      scrollTrigger: {
        trigger: ".services-section",
        start: "top center",
        end: "bottom+=4000",
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

    this.registerTrigger(revealLt.scrollTrigger);
  }

  setupServiceItems() {
    if (!this.mm) this.mm = gsap.matchMedia();

    this.mm.add("(min-width: 600px)", () => {
      const serviceTL = gsap.timeline({
        scrollTrigger: {
          trigger: ".services-section",
          start: "top top",
          end: "+=6000",
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

    this.mm.add("(max-width: 600px)", () => {
      const serviceTL = gsap.timeline({
        scrollTrigger: {
          trigger: ".services-section",
          start: "top top",
          end: "+=6000",
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
      };
    });
  }

  setupRenderControl() {
    const renderControlTrigger = ScrollTrigger.create({
      trigger: ".services-section",
      start: "top center",
      end: "bottom+=6000",
      onEnter: () => { 
        this.isServicesActive = true; 
        this.startRendering(); 
      },
      onEnterBack: () => { 
        this.isServicesActive = true; 
        this.startRendering(); 
      },
      onLeave: () => { 
        this.isServicesActive = false; 
        this.stopRendering(); 
      },
      onLeaveBack: () => { 
        this.isServicesActive = false; 
        this.stopRendering(); 
      }
    });

    this.registerTrigger(renderControlTrigger);
  }

  startRendering() {
    if (!this.rafId) {
      this.renderLoop();
    }
  }

  stopRendering() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  renderLoop() {
    if (this.isServicesActive) {
      this.renderer.render(this.scene, this.camera);
      this.rafId = requestAnimationFrame(this.renderLoop.bind(this));
    }
  }

  cleanup() {
    super.cleanup();
    
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    
    this.rings.forEach(ring => {
      if (ring.geometry) ring.geometry.dispose();
      if (ring.material) ring.material.dispose();
    });
    
    this.rings = [];
    
    this.stopRendering();
  }
}
