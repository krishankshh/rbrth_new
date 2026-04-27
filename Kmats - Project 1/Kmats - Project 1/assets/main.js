// Scroll Reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('v');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.r').forEach(el => obs.observe(el));

// FAQ Accordion
function tFaq(btn) {
  const item = btn.closest('.fi');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.fi.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// Shared Cart Logic
const CART_KEY = 'rbrth_cart';

function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += quantity;
  } else {
    cart.push({ id: productId, qty: quantity });
  }
  saveCart(cart);
}

function updateCartUI() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) {
    cartBtn.textContent = `Cart (${totalItems})`;
  }
}

// Initial UI Update
updateCartUI();

// Parallax Effect
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  
  parallaxLayers.forEach(layer => {
    const speed = layer.getAttribute('data-speed') || 0.2;
    const yPos = scrolled * speed;
    layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
  });
});

// Blog Rendering
function renderBlogs() {
  const grid = document.getElementById('blog-grid');
  if (!grid || typeof BLOGS === 'undefined') return;

  grid.innerHTML = BLOGS.map(blog => `
    <div class="bc">
      <a href="blog.html?id=${blog.id}" style="text-decoration:none; color:inherit;">
        <div class="bc-img"><img src="${blog.image}" alt="${blog.title}" /></div>
        <div class="bc-cat">${blog.category}</div>
        <div class="bc-title">${blog.title}</div>
        <div class="bc-exc">${blog.excerpt}</div>
      </a>
    </div>
  `).join('');
}

window.addEventListener('DOMContentLoaded', () => {
  renderBlogs();
  initComparison();
});

// GSAP Comparison Animation
function initComparison() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const continuous = document.querySelector(".comparisonSection.continuous");
  if (continuous) {
    const layers = continuous.querySelectorAll(".afterImage");
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: continuous,
        start: "center center",
        // Multi-image duration: scroll height is 3x width for 3 reveals
        end: () => "+=" + (continuous.offsetWidth * 3),
        scrub: true,
        pin: true,
        anticipatePin: 1
      },
      defaults: { ease: "none" }
    });

    layers.forEach((layer, i) => {
      const img = layer.querySelector("img");
      // Explicitly set z-index and initial state
      layer.style.zIndex = i + 2;
      
      tl.fromTo(layer, { xPercent: 100, x: 0 }, { xPercent: 0 })
        .fromTo(img, { xPercent: -100, x: 0 }, { xPercent: 0 }, "<");
    });

    ScrollTrigger.refresh();
  }
}

function addCart(btn, productId) {
  addToCart(productId || 'generic-product');
  
  const orig = btn.textContent;
  btn.textContent = 'ADDED ✓';
  btn.style.background = '#16a34a';
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
  }, 1400);
}

// Mobile Hamburger
const hamburger = document.getElementById('hamburger');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    let m = document.getElementById('mob-menu');
    if (m) {
      m.classList.toggle('active');
      return;
    }
    m = document.createElement('div');
    m.id = 'mob-menu';
    m.classList.add('active');
    // Basic styles moved to CSS would be better, but keeping inline for now as per original
    m.style.cssText = 'position:fixed;top:62px;left:0;right:0;background:#000;border-bottom:1px solid #1a1a1a;z-index:998;padding:20px 28px;display:flex;flex-direction:column;gap:16px;transform:translateY(-100%);transition:transform 0.3s ease;';
    
    // Add logic to show menu
    setTimeout(() => m.style.transform = 'translateY(0)', 10);

    const links = [
      { t: 'Shop by Videos', h: 'index.html#videos' },
      { t: 'Supermints', h: 'index.html#supermints' },
      { t: 'Science', h: 'index.html#science' },
      { t: 'FAQs', h: 'index.html#faq' },
      { t: 'Blog', h: 'index.html#blog' }
    ];

    links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.h;
      a.textContent = link.t;
      a.style.cssText = 'font-family:Barlow Condensed,sans-serif;font-size:15px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.7);text-decoration:none;';
      a.onclick = () => m.style.transform = 'translateY(-100%)';
      m.appendChild(a);
    });
    document.body.appendChild(m);
  });
}
// Hero Slider Logic
let currentSlide = 0;
const sliderTrack = document.querySelector('.slider-track');
const dots = document.querySelectorAll('.dot');
const totalSlides = dots.length;

function updateSlider(index) {
  if (sliderTrack) {
    sliderTrack.style.transform = `translateX(-${index * (100 / 3)}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlider(currentSlide);
}

if (totalSlides > 0) {
  let sliderInterval = setInterval(nextSlide, 5000);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(sliderInterval);
      currentSlide = i;
      updateSlider(currentSlide);
      sliderInterval = setInterval(nextSlide, 5000);
    });
  });
}
