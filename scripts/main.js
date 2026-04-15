document.addEventListener('DOMContentLoaded', () => {

    // ---- FAQ Accordion ----
    document.querySelectorAll('.faq-item').forEach(item => {
        const btn = item.querySelector('.faq-q');
        if (!btn) return;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.faq-item').forEach(o => {
                if (o !== item) o.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href').substring(1);
            if (!id) return;
            const el = document.getElementById(id);
            if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
        });
    });

    // ---- Fade-in on scroll ----
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('.sec-video-shop, .sec-products, .sec-science-hud, .sec-advantage, .sec-purity, .sec-benefits, .sec-usage, .sec-faq-social, .sec-feature-tiles, .sec-banners, .sec-blogs').forEach(s => {
        s.classList.add('fade-section');
        obs.observe(s);
    });
});
