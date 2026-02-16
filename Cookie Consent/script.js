/**
 * Project: Cookie Consent Banner
 * Description: Handles showing/hiding the banner and persisting user choice via localStorage.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Select Elements
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-btn');
    const declineBtn = document.getElementById('decline-btn');

    // Key label for localStorage
    const CONSENT_KEY = 'user_cookie_consent';

    /**
     * Shows the banner by removing the 'hidden' class
     */
    const showBanner = () => {
        // Small delay for better UX (feels less intrusive)
        setTimeout(() => {
            banner.classList.remove('hidden');
        }, 500);
    };

    /**
     * Hides the banner and saves choice to localStorage
     * @param {string} choice - 'accepted' or 'declined'
     */
    const saveConsent = (choice) => {
        // A. Persist the choice
        localStorage.setItem(CONSENT_KEY, choice);

        // B. Hide the UI
        banner.classList.add('hidden');
    };

    // 2. Initial logic: Check if user has already made a choice
    const userChoice = localStorage.getItem(CONSENT_KEY);

    if (!userChoice) {
        // No choice saved yet, show banner
        showBanner();
    } else {
        // Choice already exists, keep hidden (done by default via console/CSS)
        console.log(`Cookie consent status: ${userChoice}`);
    }

    // 3. Event Listeners
    acceptBtn.addEventListener('click', () => {
        console.log('User accepted cookies.');
        saveConsent('accepted');
    });

    declineBtn.addEventListener('click', () => {
        console.log('User declined cookies.');
        saveConsent('declined');
    });
});
