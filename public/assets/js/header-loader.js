// Header Component Loader
// Loads the header component and initializes menu functionality
(function() {
    // Function to load header component
    function loadHeader() {
        const headerContainer = document.querySelector('header');
        if (headerContainer && !headerContainer.hasAttribute('data-loaded')) {
            // Fetch the header component
            fetch('/components/header.html')
                .then(response => response.text())
                .then(html => {
                    // Store original header HTML in case it's needed
                    if (!window.originalHeaderHTML) {
                        window.originalHeaderHTML = headerContainer.innerHTML;
                    }

                    // Replace header with component
                    headerContainer.innerHTML = html;
                    headerContainer.setAttribute('data-loaded', 'true');

                    // Re-initialize menu functionality
                    initMenu();
                })
                .catch(error => {
                    console.error('Failed to load header component:', error);
                });
        }
    }

    // Initialize menu functionality
    function initMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                const isExpanded = !mobileMenu.classList.contains('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
            });
        }
    }

    // Load header when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadHeader);
    } else {
        loadHeader();
    }

    // Export function for external use if needed
    window.refreshHeader = loadHeader;
})();
