// Article data
const articles = [
    {
        id: 'cicd-pipelines',
        file: 'building-resilient-cicd.html',
        title: 'Building Resilient CI/CD Pipelines at Scale',
        description: 'Lessons learned from building pipelines that handle thousands of deployments per day with zero downtime.',
        date: 'Feb 28, 2026',
        readTime: '6 min read',
        category: 'DevOps',
        categoryColor: 'primary',
        gradient: 'from-primary-100 to-primary-50',
        iconColor: 'text-primary-300'
    },
    {
        id: 'multi-cloud',
        file: 'multi-cloud-strategy.html',
        title: 'Multi-Cloud Strategy: When and How to Implement',
        description: 'A practical guide to building and managing multi-cloud infrastructure without adding complexity.',
        date: 'Feb 21, 2026',
        readTime: '7 min read',
        category: 'Cloud',
        categoryColor: 'cyan',
        gradient: 'from-accent-cyan/20 to-accent-cyan/5',
        iconColor: 'text-accent-cyan/50'
    },
    {
        id: 'aiops-guide',
        file: 'getting-started-aiops.html',
        title: 'Getting Started with AIOps: A Practical Guide',
        description: 'How to implement AI-powered operations in your organization, from strategy to execution.',
        date: 'Feb 14, 2026',
        readTime: '10 min read',
        category: 'AIOps',
        categoryColor: 'indigo',
        gradient: 'from-accent-indigo/20 to-accent-indigo/5',
        iconColor: 'text-accent-indigo/50'
    },
    {
        id: 'mlops-production',
        file: 'mlops-production-lessons.html',
        title: 'MLOps in Production: Lessons from the Trenches',
        description: 'Real-world insights on deploying and managing ML models in production environments.',
        date: 'Feb 7, 2026',
        readTime: '8 min read',
        category: 'MLOps',
        categoryColor: 'teal',
        gradient: 'from-accent-teal/20 to-accent-teal/5',
        iconColor: 'text-accent-teal/50'
    },
    {
        id: 'industrial-iot',
        file: 'industrial-iot-sensors-insights.html',
        title: 'Industrial IoT: From Sensors to Insights',
        description: 'Building end-to-end IIoT platforms that deliver real value from industrial data.',
        date: 'Jan 31, 2026',
        readTime: '9 min read',
        category: 'IIoT',
        categoryColor: 'purple',
        gradient: 'from-purple-100 to-purple-50',
        iconColor: 'text-purple-300'
    },
    {
        id: 'database-migration',
        file: 'zero-database-migrations.html',
        title: 'Zero-Downtime Database Migrations: A Comprehensive Guide',
        description: 'Strategies and tools for migrating databases without disrupting your users.',
        date: 'Jan 24, 2026',
        readTime: '12 min read',
        category: 'Database',
        categoryColor: 'orange',
        gradient: 'from-orange-100 to-orange-50',
        iconColor: 'text-orange-300'
    }
];

const featuredArticle = {
    id: 'future-intelligent-automation',
    file: 'future-intelligent-automation.html',
    title: 'The Future of Intelligent Automation: What Every Enterprise Needs to Know',
    description: 'AI-driven automation is transforming how enterprises operate. Learn about key trends, technologies, and strategies that will define the next decade of automation.',
    date: 'March 7, 2026',
    readTime: '8 min read',
    category: 'Featured',
    categoryColor: 'primary',
    gradient: 'from-primary-100 to-primary-50',
    iconColor: 'text-primary-300'
};

let currentFilter = 'all';
let displayedArticles = 6;

// Render article cards
function renderArticles() {
    const grid = document.getElementById('articles-grid');
    grid.innerHTML = '';

    let filteredArticles = currentFilter === 'all'
        ? articles
        : articles.filter(article => {
            if (currentFilter === 'ai') {
                return ['AIOps', 'MLOps'].includes(article.category);
            }
            return article.category.toLowerCase() === currentFilter;
        });

    if (filteredArticles.length === 0) {
        document.getElementById('no-articles').classList.remove('hidden');
    } else {
        document.getElementById('no-articles').classList.add('hidden');

        filteredArticles.slice(0, displayedArticles).forEach(article => {
            const categoryClass = {
                'DevOps': 'bg-primary-100 text-primary-600',
                'Cloud': 'bg-accent-cyan/10 text-accent-cyan',
                'AIOps': 'bg-accent-indigo/10 text-accent-indigo',
                'MLOps': 'bg-accent-teal/10 text-accent-teal',
                'IIoT': 'bg-purple-100 text-purple-600',
                'Database': 'bg-orange-100 text-orange-600'
            }[article.category];

            const card = document.createElement('article');
            card.className = 'article-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all';
            card.onclick = function() { openArticle(article.id); };
            card.innerHTML = `
                <div class="h-48 bg-gradient-to-br ${article.gradient} flex items-center justify-center">
                    <svg class="w-16 h-16 ${article.iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                </div>
                <div class="p-6">
                    <span class="inline-block px-2 py-1 ${categoryClass} rounded text-xs font-medium mb-3">${article.category}</span>
                    <h3 class="font-bold text-dark-900 mb-2">${article.title}</h3>
                    <p class="text-gray-600 text-sm mb-4">${article.description}</p>
                    <div class="flex items-center justify-between text-sm text-gray-500">
                        <span>${article.date}</span>
                        <span>${article.readTime}</span>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }
}

// Filter articles
function filterArticles(category) {
    currentFilter = category;
    displayedArticles = 6;

    // Update button styles
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.classList.remove('bg-white', 'border-gray-200');
        btn.classList.add('text-gray-600');
    });

    event.target.classList.remove('text-gray-600');
    event.target.classList.add('bg-white', 'border-gray-200');

    renderArticles();
}

// Load more articles
function loadMoreArticles() {
    displayedArticles += 6;
    renderArticles();
}

// Open article in modal
async function openArticle(articleId) {
    const modal = document.getElementById('article-modal');
    const modalContent = document.getElementById('modal-article-content');

    modalContent.innerHTML = `
        <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    try {
        const articleFile = articleId === 'featured'
            ? featuredArticle.file
            : articles.find(function(a) { return a.id === articleId; })?.file;

        if (!articleFile) {
            throw new Error('Article not found');
        }

        const response = await fetch('/blog/articles/' + articleFile);
        if (!response.ok) {
            throw new Error('Failed to load article');
        }

        const html = await response.text();

        // Extract body content from article
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const articleBody = doc.querySelector('body');

        modalContent.innerHTML = articleBody.innerHTML;

        // Add close button at bottom
        const closeBtn = document.createElement('div');
        closeBtn.className = 'flex justify-center mt-8 mb-4';
        closeBtn.innerHTML = `
            <button onclick="closeModal()" class="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Close Article
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        `;
        modalContent.appendChild(closeBtn);

    } catch (error) {
        modalContent.innerHTML = `
            <div class="text-center py-12">
                <p class="text-red-600 font-semibold mb-4">Error loading article</p>
                <p class="text-gray-600">${error.message}</p>
                <button onclick="closeModal()" class="mt-4 text-primary-600 font-medium hover:underline">Close</button>
            </div>
        `;
    }
}

// Close modal
function closeModal(event) {
    if (event && event.target !== document.getElementById('article-modal') && !event.target.classList.contains('close-modal')) {
        return;
    }

    const modal = document.getElementById('article-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderArticles);
} else {
    renderArticles();
}
