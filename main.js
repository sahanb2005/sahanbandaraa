// Three.js, GSAP, and Lenis Initialization

// 1. Smooth Scroll (Lenis)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// 2. Three.js Scene Setup (Interactive background)
const initThree = () => {
  const canvas = document.querySelector('#hero-canvas');
  if(!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles
  const particlesGeometry = new THREE.BufferGeometry();
  const count = 3000;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: null, // Use a small texture for better look
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  camera.position.z = 3;

  // Mouse Movement Interaction
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) - 0.5;
    mouseY = (event.clientY / window.innerHeight) - 0.5;
  });

  const clock = new THREE.Clock();

  const animate = () => {
    const elapsedTime = clock.getElapsedTime();

    // Rotate particles
    particles.rotation.y = elapsedTime * 0.05;
    particles.rotation.x = -mouseY * 0.5;
    particles.rotation.y = mouseX * 0.5;

    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
  };

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
};

// 3. GSAP Animations
const initGSAP = () => {
  gsap.registerPlugin(ScrollTrigger);

  // Hero Animations
  gsap.from('.hero-h1', {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: 'power4.out',
    delay: 0.5
  });

  gsap.from('.hero-p', {
    y: 50,
    opacity: 0,
    duration: 1.5,
    ease: 'power4.out',
    delay: 0.8
  });

  // Reveal Sections
  const revealItems = document.querySelectorAll('.skill-card, .project-item, .section-title, .about-banner-wrapper, .about-content, .category-header, .tech-item');
  revealItems.forEach((item) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  });

  // Skill Bar Fills
  const skillBars = document.querySelectorAll('.progress-bar');
  skillBars.forEach((bar) => {
    const targetWidth = bar.getAttribute('data-percent') + '%';
    gsap.to(bar, {
      scrollTrigger: {
        trigger: bar,
        start: 'top 90%'
      },
      width: targetWidth,
      duration: 1.5,
      ease: 'power2.inOut'
    });
  });
};

// Initialize everything
window.addEventListener('DOMContentLoaded', () => {
  initThree();
  initGSAP();
});
