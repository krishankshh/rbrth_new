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
    existing.qty += parseInt(quantity);
  } else {
    cart.push({ id: productId, qty: parseInt(quantity) });
  }
  saveCart(cart);
  openCart(); // Auto-open drawer
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
  injectCartDrawer();
  injectSearchOverlay();
  injectBackToTop();
  updateNavIcons();
  initNewsletter();
  if (window.location.pathname.includes('product.html')) {
    setTimeout(initStickyBar, 500);
  }
});

function injectBackToTop() {
    if (document.getElementById('back-to-top')) return;
    const btn = `<div id="back-to-top" onclick="window.scrollTo({top:0, behavior:'smooth'})">↑</div>`;
    document.body.insertAdjacentHTML('beforeend', btn);
    
    window.addEventListener('scroll', () => {
        const btt = document.getElementById('back-to-top');
        if (window.scrollY > 500) btt.classList.add('active');
        else btt.classList.remove('active');
    });
}

function initNewsletter() {
    const subBtn = document.querySelector('.fsub-row button');
    const subInput = document.querySelector('.fsub-row input');
    if (!subBtn) return;
    
    subBtn.addEventListener('click', () => {
        if (!subInput.value.includes('@')) {
            alert('Please enter a valid email.');
            return;
        }
        const origText = subBtn.textContent;
        subBtn.textContent = 'DONE ✓';
        subBtn.style.background = '#16a34a';
        subInput.value = '';
        setTimeout(() => {
            subBtn.textContent = origText;
            subBtn.style.background = '';
        }, 3000);
    });
}

function updateNavIcons() {
    const navRight = document.querySelector('.nav-right');
    if (!navRight) return;
    
    // Add Search and Account icons if they don't exist
    if (!document.getElementById('search-toggle')) {
        const searchBtn = `
            <a href="#" class="nav-link" id="search-toggle" aria-label="Search" onclick="event.preventDefault(); openSearch();">
                <img src="https://api.iconify.design/lucide:search.svg?color=white" style="width:20px; vertical-align:middle;" alt="">
            </a>
        `;
        const accountBtn = `
            <a href="login.html" class="nav-link" id="account-link" aria-label="My Account">
                <img src="https://api.iconify.design/lucide:user.svg?color=white" style="width:20px; vertical-align:middle;" alt="">
            </a>
        `;
        navRight.insertAdjacentHTML('afterbegin', searchBtn + accountBtn);
    }
}

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

// AJAX Cart Drawer Injection
function injectCartDrawer() {
  if (document.getElementById('cart-drawer-container')) return;

  const drawerHTML = `
    <div id="cart-drawer-container">
      <div class="cart-drawer-overlay" id="drawer-overlay" onclick="closeCart()"></div>
      <div class="cart-drawer" id="cart-drawer">
        <div class="cart-drawer-header">
          <h2>Your Bag</h2>
          <button class="cart-drawer-close" onclick="closeCart()">✕</button>
        </div>
        <div class="cart-drawer-items" id="drawer-items">
          <!-- Items will be injected here -->
        </div>
        <div class="cart-drawer-footer">
          <div class="drawer-subtotal">
            <span>Subtotal</span>
            <span id="drawer-total">₹0</span>
          </div>
          <button class="pc-btn" style="width:100%; padding: 20px;" onclick="location.href='checkout.html'">Checkout</button>
          <a href="cart.html" style="display:block; text-align:center; margin-top:16px; font-size:12px; color:rgba(255,255,255,0.4); text-transform:uppercase; font-weight:700; letter-spacing:0.1em; text-decoration:none;">View full cart</a>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', drawerHTML);
}

function openCart() {
  injectCartDrawer();
  renderDrawerItems();
  document.getElementById('drawer-overlay').classList.add('active');
  document.getElementById('cart-drawer').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('drawer-overlay').classList.remove('active');
  document.getElementById('cart-drawer').classList.remove('active');
  document.body.style.overflow = '';
}

function renderDrawerItems() {
  const itemsContainer = document.getElementById('drawer-items');
  const totalEl = document.getElementById('drawer-total');
  const cart = getCart();

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = '<p style="text-align:center; padding-top:40px; color:rgba(255,255,255,0.3);">Your bag is empty.</p>';
    totalEl.textContent = '₹0';
    return;
  }

  let total = 0;
  itemsContainer.innerHTML = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id) || { name: 'Unknown', price: 0, mainImage: '' };
    total += product.price * item.qty;
    return `
      <div class="drawer-item">
        <img src="${product.mainImage}" class="drawer-item-img" alt="">
        <div class="drawer-item-info">
          <div class="drawer-item-name">${product.name}</div>
          <div class="drawer-item-price">₹${product.price.toLocaleString()}</div>
          <div class="drawer-item-qty">
            <button onclick="updateDrawerQty('${item.id}', -1)">-</button>
            <span>${item.qty}</span>
            <button onclick="updateDrawerQty('${item.id}', 1)">+</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  totalEl.textContent = `₹${total.toLocaleString()}`;
}

function updateDrawerQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = Math.max(1, item.qty + delta);
    saveCart(cart);
    renderDrawerItems();
  }
}

// Hook into existing cart buttons
document.addEventListener('click', e => {
    const cartToggle = e.target.closest('#cart-btn');
    if (cartToggle) {
        e.preventDefault();
        openCart();
    }
});

// Sticky Mobile Bar Logic
function initStickyBar() {
    const productInfo = document.querySelector('.product-info');
    if (!productInfo) return;

    const stickyBarHTML = `
        <div class="sticky-cart-bar" id="sticky-bar">
            <div class="sticky-info">
                <div class="sticky-title">${document.getElementById('p-title')?.textContent || 'RBRTH Product'}</div>
                <div class="sticky-price">${document.getElementById('p-price')?.textContent || ''}</div>
            </div>
            <button class="pc-btn" style="padding: 12px 24px;" onclick="addCart(this, '${new URLSearchParams(window.location.search).get('id') || 'generic'}')">ADD TO CART</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', stickyBarHTML);

    const bar = document.getElementById('sticky-bar');
    const cartBtn = document.querySelector('.add-cart-btn');

    window.addEventListener('scroll', () => {
        if (window.innerWidth > 768) return;
        const trigger = cartBtn ? cartBtn.getBoundingClientRect().top + window.scrollY : 500;
        if (window.scrollY > trigger) {
            bar.classList.add('active');
        } else {
            bar.classList.remove('active');
        }
    });
}

// Predictive Search Logic
function injectSearchOverlay() {
  if (document.getElementById('search-overlay-container')) return;

  const searchHTML = `
    <div id="search-overlay-container" class="search-overlay">
      <div class="search-overlay-close" onclick="closeSearch()">✕</div>
      <div class="search-inner">
        <input type="text" id="search-input" class="search-field" placeholder="Search RBRTH..." oninput="handleSearch(this.value)">
        <div id="search-results" class="search-suggestions"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', searchHTML);
}

function openSearch() {
  const overlay = document.getElementById('search-overlay-container');
  overlay.classList.add('active');
  document.getElementById('search-input').focus();
  document.body.style.overflow = 'hidden';
}

function closeSearch() {
  document.getElementById('search-overlay-container').classList.remove('active');
  document.body.style.overflow = '';
}

function handleSearch(query) {
  const resultsBox = document.getElementById('search-results');
  if (!query || query.length < 2) {
    resultsBox.innerHTML = '';
    return;
  }

  const matches = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.description.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  if (matches.length === 0) {
    resultsBox.innerHTML = '<p style="padding:20px; color:rgba(255,255,255,0.3);">No matches found.</p>';
    return;
  }

  resultsBox.innerHTML = matches.map(p => `
    <a href="product.html?id=${p.id}" class="suggestion-item">
      <img src="${p.mainImage}" alt="">
      <div>
        <div class="suggestion-name">${p.name}</div>
        <div class="suggestion-price">₹${p.price}</div>
      </div>
    </a>
  `).join('') + `<a href="search.html?q=${query}" class="suggestion-footer">View all results</a>`;
}

// Wishlist Logic
function getWishlist() {
    return JSON.parse(localStorage.getItem('rbrth_wishlist') || '[]');
}

function saveWishlist(list) {
    localStorage.setItem('rbrth_wishlist', JSON.stringify(list));
    updateWishlistCount();
}

function toggleWishlist(id) {
    let list = getWishlist();
    const index = list.indexOf(id);
    if (index > -1) {
        list.splice(index, 1);
    } else {
        list.push(id);
    }
    saveWishlist(list);
    
    // UI Feedback
    const btn = document.getElementById(`wish-${id}`);
    if (btn) {
        const img = btn.querySelector('img');
        img.src = list.includes(id) 
            ? 'https://api.iconify.design/lucide:heart.svg?color=red' 
            : 'https://api.iconify.design/lucide:heart.svg?color=white';
    }
}

function updateWishlistCount() {
    // Optional: add a count in header
}
