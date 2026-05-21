/*!
* Manor v1.0.0 (https://arboraistudio.github.io/manor-home)
* Copyright 2026 Arbor AI Studio
* Licensed under MIT
*/
//
// Scripts
//

window.addEventListener('DOMContentLoaded', function () {

    // Activate Bootstrap scrollspy on the main nav element
    var mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    }

    // Collapse responsive navbar when toggler is visible
    var navbarToggler = document.body.querySelector('.navbar-toggler');
    var responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.forEach(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', function () {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Initialize screenshot carousels
    initCarousel('heroCarousel', 4000);
    initCarousel('featuresCarousel', 5000);
    initCarousel('aboutCarousel', 6000);

});

function initCarousel(containerId, interval) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var slides = container.querySelectorAll('img');
    if (slides.length === 0) return;

    var currentIndex = 0;

    // Show first slide
    slides[0].classList.add('active');

    function showSlide(index) {
        slides.forEach(function (slide) {
            slide.classList.remove('active');
        });
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    // Auto-advance
    setInterval(nextSlide, interval);
}
