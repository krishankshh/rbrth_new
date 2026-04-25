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

// Add to Cart
let cartCount = 0;
function addCart(btn) {
  cartCount++;
  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) cartBtn.textContent = `Cart (${cartCount})`;
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
    if (m) { m.remove(); return; }
    m = document.createElement('div');
    m.id = 'mob-menu';
    m.style.cssText = 'position:fixed;top:98px;left:0;right:0;background:#000;border-bottom:1px solid #1a1a1a;z-index:998;padding:20px 28px;display:flex;flex-direction:column;gap:16px;';
    ['Shop by Videos', 'Supermints', 'Science', 'FAQs', 'Blog'].forEach(t => {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = t;
      a.style.cssText = 'font-family:Barlow Condensed,sans-serif;font-size:15px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.7);text-decoration:none;';
      m.appendChild(a);
    });
    document.body.appendChild(m);
  });
}
