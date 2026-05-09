document.addEventListener('DOMContentLoaded', () => {
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
