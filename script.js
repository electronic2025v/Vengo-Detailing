document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initMobileNav();
    initComparisonSliders();
    initRevealAnimations();
});

/* =========================
   Header shadow on scroll
========================= */

function initHeader() {
    const header = document.querySelector("[data-header]");

    if (!header) return;

    const updateHeader = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 12);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
}

/* =========================
   Mobile navigation
========================= */

function initMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    const navLinks = document.querySelectorAll(".site-nav a");

    if (!toggle || !nav) return;

    const closeMenu = () => {
        toggle.classList.remove("is-open");
        nav.classList.remove("is-open");
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
    };

    const openMenu = () => {
        toggle.classList.add("is-open");
        nav.classList.add("is-open");
        document.body.classList.add("menu-open");
        toggle.setAttribute("aria-expanded", "true");
    };

    toggle.addEventListener("click", () => {
        const isOpen = nav.classList.contains("is-open");
        isOpen ? closeMenu() : openMenu();
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
        const clickedInsideNav = nav.contains(event.target);
        const clickedToggle = toggle.contains(event.target);

        if (!clickedInsideNav && !clickedToggle && nav.classList.contains("is-open")) {
            closeMenu();
        }
    });
}

/* =========================
   Before / After slider
========================= */

function initComparisonSliders() {
    const sliders = document.querySelectorAll("[data-comparison]");

    sliders.forEach((slider) => {
        let isDragging = false;
        let currentPosition = 50;

        const setPosition = (clientX) => {
            const rect = slider.getBoundingClientRect();
            const rawPosition = ((clientX - rect.left) / rect.width) * 100;
            currentPosition = Math.min(100, Math.max(0, rawPosition));

            slider.style.setProperty("--position", `${currentPosition}%`);
        };

        const startDragging = (event) => {
            isDragging = true;
            slider.setPointerCapture?.(event.pointerId);
            setPosition(event.clientX);
        };

        const whileDragging = (event) => {
            if (!isDragging) return;
            setPosition(event.clientX);
        };

        const stopDragging = (event) => {
            isDragging = false;

            if (slider.hasPointerCapture?.(event.pointerId)) {
                slider.releasePointerCapture(event.pointerId);
            }
        };

        slider.addEventListener("pointerdown", startDragging);
        slider.addEventListener("pointermove", whileDragging);
        slider.addEventListener("pointerup", stopDragging);
        slider.addEventListener("pointercancel", stopDragging);
        slider.addEventListener("lostpointercapture", () => {
            isDragging = false;
        });

        slider.addEventListener("keydown", (event) => {
            const step = event.shiftKey ? 10 : 4;

            if (event.key === "ArrowLeft") {
                currentPosition = Math.max(0, currentPosition - step);
                slider.style.setProperty("--position", `${currentPosition}%`);
                event.preventDefault();
            }

            if (event.key === "ArrowRight") {
                currentPosition = Math.min(100, currentPosition + step);
                slider.style.setProperty("--position", `${currentPosition}%`);
                event.preventDefault();
            }
        });
    });
}

/* =========================
   Smooth reveal animations
========================= */

function initRevealAnimations() {
    const items = document.querySelectorAll("[data-reveal]");

    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    items.forEach((item, index) => {
        item.style.transitionDelay = `${Math.min(index * 35, 220)}ms`;
        observer.observe(item);
    });
}document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');

    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('nav-open');
        });
    }

    // Before/After slider
    const sliderContainers = document.querySelectorAll('.slider-container');
    sliderContainers.forEach(container => {
        const slider = container.querySelector('.slider');
        const beforeImg = container.querySelector('.before-img');
        const afterImg = container.querySelector('.after-img');
        const handle = container.querySelector('.slider-handle');
        let isDragging = false;

        const updateSlider = (x) => {
            const rect = slider.getBoundingClientRect();
            let percent = ((x - rect.left) / rect.width) * 100;
            if (percent < 0) percent = 0;
            if (percent > 100) percent = 100;
            beforeImg.style.width = percent + '%';
            handle.style.left = `calc(${percent}% - 8px)`; // handle width 16px, half is 8px
        };

        const startDrag = (e) => {
            isDragging = true;
            const x = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
            updateSlider(x);
        };

        const moveDrag = (e) => {
            if (!isDragging) return;
            const x = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
            updateSlider(x);
        };

        const stopDrag = () => {
            isDragging = false;
        };

        // Mouse events
        slider.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', moveDrag);
        window.addEventListener('mouseup', stopDrag);
        // Touch events
        slider.addEventListener('touchstart', startDrag);
        window.addEventListener('touchmove', moveDrag);
        window.addEventListener('touchend', stopDrag);
    });
});

// Konami code Easter egg
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0; // reset after activation
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Create confetti effect
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '9999';
    confettiContainer.style.overflow = 'hidden';
    document.body.appendChild(confettiContainer);

    // Create confetti pieces
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 50%)`;
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `-10%`;
        confetti.style.borderRadius = '50%';
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        confettiContainer.appendChild(confetti);
    }

    // Add a fun message
    const message = document.createElement('div');
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    message.style.color = '#fff';
    message.style.padding = '20px 40px';
    message.style.borderRadius = '10px';
    message.style.fontSize = '24px';
    message.style.fontFamily = 'Arial, sans-serif';
    message.style.textAlign = 'center';
    message.style.zIndex = '10000';
    message.innerHTML = '🎉 ¡Easter egg activado! 🎉<br>Eres un verdadero fan del detailing!';
    document.body.appendChild(message);

    // Remove after 5 seconds
    setTimeout(() => {
        confettiContainer.remove();
        message.remove();
    }, 5000);
}

// Add CSS for confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(105vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
