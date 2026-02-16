/**
 * Project: Simple Tabs Component
 * Description: Functional logic for tab switching and accessibility management.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Select all tab buttons and panels
    const tabButtons = document.querySelectorAll('[role="tab"]');
    const tabPanels = document.querySelectorAll('[role="tabpanel"]');
    const tabList = document.querySelector('[role="tablist"]');

    /**
     * Function to switch tabs
     * @param {HTMLElement} targetTab - The tab button that was clicked/selected
     */
    const switchTab = (targetTab) => {
        // A. Remove active state from all buttons
        tabButtons.forEach(btn => {
            btn.setAttribute('aria-selected', 'false');
            btn.setAttribute('tabindex', '-1');
        });

        // B. Set current tab as active
        targetTab.setAttribute('aria-selected', 'true');
        targetTab.setAttribute('tabindex', '0');
        targetTab.focus();

        // C. Hide all panels
        tabPanels.forEach(panel => {
            panel.setAttribute('hidden', '');
        });

        // D. Show the target panel
        const targetPanelId = targetTab.getAttribute('data-target');
        const targetPanel = document.getElementById(targetPanelId);
        if (targetPanel) {
            targetPanel.removeAttribute('hidden');
        }
    };

    // 2. Add Click Events to all tabs
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            switchTab(e.currentTarget);
        });
    });

    // 3. Add Keyboard Navigation (Accessibility Enhancement)
    tabList.addEventListener('keydown', (e) => {
        const tabsArray = Array.from(tabButtons);
        const currentIndex = tabsArray.indexOf(document.activeElement);

        let nextTabIndex;

        // Handle Right and Left arrow keys
        if (e.key === 'ArrowRight') {
            nextTabIndex = (currentIndex + 1) % tabsArray.length;
            switchTab(tabsArray[nextTabIndex]);
        } else if (e.key === 'ArrowLeft') {
            nextTabIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
            switchTab(tabsArray[nextTabIndex]);
        }
    });
});
