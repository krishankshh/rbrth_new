// Scroll Reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('v'); obs.unobserve(e.target); }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.r').forEach(el => obs.observe(el));

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
function selectVariant(el, src) {
  document.querySelectorAll('.vt').forEach(v => v.classList.remove('active'));
  el.classList.add('active');
  const img = document.getElementById('main-img');
  img.style.opacity = '0';
  setTimeout(() => { img.src = src; img.style.opacity = '1'; }, 200);
}

// Add to Cart feedback
function addedToCart(btn) {
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
