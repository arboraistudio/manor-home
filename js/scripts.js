/*!
* Manor v1.0.0 (https://manor.arboraistudio.com)
* Copyright 2026 Arbor AI Studio
* Licensed under MIT
*/
//
// Scripts
//

window.addEventListener('DOMContentLoaded', function () {

    var androidDownloadLocation = 'General';

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

    // Guide Android users through tester enrollment before Google Play.
    var androidAccessModal = document.getElementById('androidAccessModal');
    var androidJoinGroup = document.getElementById('androidJoinGroup');
    var androidStepOne = document.querySelector('[data-android-step="1"]');
    var androidStepTwo = document.querySelector('[data-android-step="2"]');
    var androidStepLockedCopy = document.querySelector('.android-step-locked');
    var androidPlayStoreLink = document.getElementById('androidPlayStoreLink');
    var androidAccessStatus = document.getElementById('androidAccessStatus');

    function hasOpenedAndroidTesterGroup() {
        try {
            return window.localStorage.getItem('manorAndroidTesterGroupOpened') === 'true';
        } catch (error) {
            return false;
        }
    }

    function unlockAndroidDownload() {
        if (!androidStepOne || !androidStepTwo || !androidPlayStoreLink) return;

        androidStepOne.classList.remove('is-active');
        androidStepOne.classList.add('is-complete');
        androidStepTwo.classList.remove('is-locked');
        androidStepTwo.classList.add('is-active');
        androidPlayStoreLink.hidden = false;
        if (androidStepLockedCopy) androidStepLockedCopy.hidden = true;
        if (androidAccessStatus) {
            androidAccessStatus.textContent = 'Step 1 complete. The Google Play link is now available in Step 2.';
        }
    }

    if (hasOpenedAndroidTesterGroup()) {
        unlockAndroidDownload();
    }

    if (androidAccessModal) {
        androidAccessModal.addEventListener('show.bs.modal', function (event) {
            var trigger = event.relatedTarget;
            if (trigger && trigger.dataset.downloadLocation) {
                androidDownloadLocation = trigger.dataset.downloadLocation;
            }
        });
    }

    if (androidJoinGroup) {
        androidJoinGroup.addEventListener('click', function () {
            try {
                window.localStorage.setItem('manorAndroidTesterGroupOpened', 'true');
            } catch (error) {
                // The flow still works when storage is unavailable.
            }
            unlockAndroidDownload();

            if (typeof gtag === 'function') {
                gtag('event', 'join_android_testers', {
                    'location': androidDownloadLocation,
                    'link_url': androidJoinGroup.href
                });
            }
        });
    }

    // Track App Downloads in Google Analytics
    var downloadLinks = document.querySelectorAll('a[href*="play.google.com"], a[href*="testflight.apple.com"]');
    downloadLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            var href = link.getAttribute('href');
            var platform = href.includes('play.google.com') ? 'Android' : 'iOS';
            var location = platform === 'Android'
                ? androidDownloadLocation
                : (link.closest('.masthead') ? 'Hero' : 'Download');
            
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
