// Scroll Reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('v'); obs.unobserve(e.target); }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.r').forEach(el => obs.observe(el));

// Global Product Reference
let currentProduct = null;

// Initialization Logic
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'spear-mints';
  currentProduct = PRODUCTS.find(p => p.id === id);

  if (currentProduct) {
    populateProduct(currentProduct);
  } else {
    // Fallback or Redirect
    console.error("Product not found:", id);
    window.location.href = 'index.html';
  }
});

function populateProduct(p) {
  // Text content
  document.getElementById('p-title').textContent = p.name;
  document.getElementById('p-desc').textContent = p.description;
  document.getElementById('breadcrumb-current').textContent = p.name;
  document.title = `${p.name} | RBRTH`;
  
  // Price
  document.getElementById('p-price').textContent = `₹${p.price.toLocaleString()}`;
  document.getElementById('p-price-orig').textContent = `₹${p.originalPrice.toLocaleString()}`;
  const off = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  document.getElementById('p-price-off').textContent = `-${off}% OFF`;

  // Main Image
  const mainImg = document.getElementById('main-img');
  mainImg.src = p.mainImage;

  // Icons
  const iconsContainer = document.getElementById('p-icons');
  iconsContainer.innerHTML = p.icons.map((icon, index) => `
    <div class="icon-item">
      <div class="icon-circle"><img src="${icon.icon}" alt="${icon.label}" /></div>
      <span class="icon-label">${icon.label.replace(' & ', '<br>') }</span>
    </div>
    ${index < p.icons.length - 1 ? '<div class="icon-divider"></div>' : ''}
  `).join('');

  // Variants
  const variantsContainer = document.getElementById('p-variants');
  variantsContainer.innerHTML = p.variants.map((v, index) => `
    <div class="vt ${index === 0 ? 'active' : ''} ${v.soldOut ? 'sold-out' : ''}" 
         onclick="selectVariant(this, '${v.image}', ${v.price}, ${v.soldOut || false})">
      <img src="${v.image}" alt="${v.name}" />
      <div class="vt-name">${v.name} ${v.soldOut ? '(SOLD OUT)' : ''}</div>
    </div>
  `).join('');

  // Thumbnails
  const thumbsContainer = document.getElementById('p-thumbs');
  thumbsContainer.innerHTML = p.thumbnails.map((src, index) => `
    <div class="thumb ${index === 0 ? 'active' : ''}" onclick="switchThumb(this, '${src}')">
      <img src="${src}" alt="Thumb ${index + 1}" />
    </div>
  `).join('');
}

// Quantity
let qty = 1;
function changeQty(d) {
  qty = Math.max(1, qty + d);
  document.getElementById('qty').textContent = qty;
}

// Switch main image via thumbnails
function switchThumb(el, src) {
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const img = document.getElementById('main-img');
  img.style.opacity = '0';
  setTimeout(() => { img.src = src; img.style.opacity = '1'; }, 200);
}

// Variant selection
function selectVariant(el, src, price, isSoldOut = false) {
  if (isSoldOut) return;

  document.querySelectorAll('.vt').forEach(v => v.classList.remove('active'));
  el.classList.add('active');
  
  const img = document.getElementById('main-img');
  img.style.opacity = '0';
  setTimeout(() => { img.src = src; img.style.opacity = '1'; }, 200);

  if (price) {
    document.getElementById('p-price').textContent = `₹${price.toLocaleString()}`;
  }

  const addBtn = document.querySelector('.add-cart-btn');
  if (addBtn) {
    addBtn.disabled = isSoldOut;
    addBtn.textContent = isSoldOut ? 'SOLD OUT' : 'ADD TO CART';
  }
}

// Add to Cart feedback (updated for persistent cart)
function addedToCart(btn) {
  if (currentProduct) {
    addToCart(currentProduct.id, qty);
  }
  
  const orig = btn.textContent;
  btn.textContent = 'ADDED ✓';
  btn.style.background = '#16a34a';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 1500);
}

// Batch Lab Report toggle
function toggleBatch() {
  const body = document.getElementById('batch-body');
  const plus = document.getElementById('batch-plus');
  body.classList.toggle('open');
  plus.style.transform = body.classList.contains('open') ? 'rotate(45deg)' : '';
  plus.style.color = body.classList.contains('open') ? '#fff' : '';
}
