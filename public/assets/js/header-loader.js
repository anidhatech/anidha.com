// Header Component Loader
// Loads header component and initializes menu functionality
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

                    // Highlight active page in navigation
                    highlightActivePage();
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

    // Highlight the active page in navigation
    function highlightActivePage() {
        // Get current page path
        const currentPath = window.location.pathname;

        // Desktop navigation
        const desktopNavLinks = document.querySelectorAll('nav .nav-link');
        desktopNavLinks.forEach(link => {
            const linkPath = link.getAttribute('href');

            // Check if this is the active link - match exact path
            let isActive = false;
            if (linkPath === '/') {
                // Home page
                isActive = currentPath === '/' || currentPath === '/index.html' || currentPath === '/index.html/';
            } else {
                // Other pages - check if current path ends with the link path
                isActive = currentPath.endsWith(linkPath) || currentPath === linkPath || currentPath === linkPath + '/';
            }

            if (isActive) {
                // Remove all active classes
                desktopNavLinks.forEach(l => {
                    l.classList.remove('text-primary-600', 'font-semibold');
                    l.classList.add('text-gray-600');
                });

                // Add active classes to current link
                link.classList.remove('text-gray-600');
                link.classList.add('text-primary-600', 'font-semibold');
            }
        });

        // Mobile navigation
        const mobileNavLinks = document.querySelectorAll('#mobile-menu .mobile-nav-link');
        mobileNavLinks.forEach(link => {
            const linkPath = link.getAttribute('href');

            // Check if this is the active link - match exact path
            let isActive = false;
            if (linkPath === '/') {
                // Home page
                isActive = currentPath === '/' || currentPath === '/index.html' || currentPath === '/index.html/';
            } else {
                // Other pages - check if current path ends with the link path
                isActive = currentPath.endsWith(linkPath) || currentPath === linkPath || currentPath === linkPath + '/';
            }

            if (isActive) {
                // Remove all active classes from mobile nav
                mobileNavLinks.forEach(l => {
                    l.classList.remove('text-primary-600');
                    l.classList.add('text-gray-600');
                });

                // Add active classes to current mobile link
                link.classList.remove('text-gray-600');
                link.classList.add('text-primary-600');
            }
        });
    }

    // Load header when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadHeader);
    } else {
        loadHeader();
    }

    // Export function for external use if needed
    window.refreshHeader = loadHeader;
    window.highlightActivePage = highlightActivePage;
})();
