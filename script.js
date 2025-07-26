document.addEventListener('DOMContentLoaded', () => {
    // --- Sticky Navigation ---
    const nav = document.getElementById('main-nav');
    const hero = document.getElementById('hero');
    const heroHeight = hero.offsetHeight;

    window.addEventListener('scroll', () => {
        if (window.scrollY > heroHeight) {
            nav.classList.add('sticky');
        } else {
            nav.classList.remove('sticky');
        }
    });

    // --- Smooth Scrolling for Nav Links ---
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const offsetTop = targetElement.offsetTop - nav.offsetHeight;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Fade-in Animation on Scroll ---
    const sections = document.querySelectorAll('.fade-in');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});