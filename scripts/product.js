// ============================================
// Product Page Scripts
// ============================================
document.addEventListener('DOMContentLoaded', () => {

    // ---- Quantity Control ----
    const qtyVal = document.getElementById('qty-val');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');

    if (qtyVal && qtyMinus && qtyPlus) {
        let qty = 1;
        qtyMinus.addEventListener('click', () => {
            if (qty > 1) { qty--; qtyVal.textContent = qty; }
        });
        qtyPlus.addEventListener('click', () => {
            if (qty < 10) { qty++; qtyVal.textContent = qty; }
        });
    }

    // ---- Variant Selector ----
    document.querySelectorAll('.pdp-variant').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.pdp-variant').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // ---- Size Selector ----
    document.querySelectorAll('.pdp-size').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.pdp-size').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // ---- Thumbnail Gallery ----
    const mainImg = document.getElementById('pdp-main-img');
    const thumbs = document.querySelectorAll('.pdp-thumb');

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbs.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            const img = thumb.querySelector('img');
            if (mainImg && img) {
                mainImg.src = img.src;
            }
        });
    });

    // ---- Gallery Nav Arrows ----
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    let currentIndex = 0;

    if (prevBtn && nextBtn && thumbs.length > 0) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + thumbs.length) % thumbs.length;
            thumbs[currentIndex].click();
        });
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % thumbs.length;
            thumbs[currentIndex].click();
        });
    }
});
