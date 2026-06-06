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

    // Track App Downloads in Google Analytics
    var downloadLinks = document.querySelectorAll('a[href*="play.google.com"], a[href*="testflight.apple.com"]');
    downloadLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            var href = link.getAttribute('href');
            var platform = href.includes('play.google.com') ? 'Android' : 'iOS';
            var location = link.closest('.masthead') ? 'Hero' : 'Footer';
            
            if (typeof gtag === 'function') {
                gtag('event', 'click_download', {
                    'platform': platform,
                    'location': location,
                    'link_url': href
                });
            }
        });
    });

    // Track Community Clicks in Google Analytics
    var communityLinks = document.querySelectorAll('a[href*="discord.gg"], a[href*="reddit.com"], a[href*="github.com"]');
    communityLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            var href = link.getAttribute('href');
            var platform = '';
            if (href.includes('discord.gg')) platform = 'Discord';
            else if (href.includes('reddit.com')) platform = 'Reddit';
            else if (href.includes('github.com')) platform = 'GitHub';
            
            var location = 'General';
            if (link.closest('#feedbackModal')) location = 'Modal';
            else if (link.closest('.cta')) location = 'CTA';
            else if (link.closest('footer')) location = 'Footer';
            
            if (typeof gtag === 'function' && platform) {
                gtag('event', 'click_community', {
                    'platform': platform,
                    'location': location,
                    'link_url': href
                });
            }
        });
    });

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
