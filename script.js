// Navigation functionality
const articleLinks = document.querySelectorAll('.article-link');
const sectionLinks = document.querySelectorAll('.section-link');
const contentArticles = document.querySelectorAll('.content-article');
const nextBtn = document.getElementById('nextBtn');
const progressSpan = document.getElementById('currentProgress');
let currentArticleIndex = 0;

// Handle article navigation clicks
articleLinks.forEach((link, index) => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active state from all links
        articleLinks.forEach(l => l.classList.remove('active'));
        sectionLinks.forEach(l => l.classList.remove('active'));
        
        // Add active state to clicked article link
        this.classList.add('active');
        
        // Add active state to parent section
        const parentSection = this.closest('.ml-2').querySelector('.section-link');
        if (parentSection) {
            parentSection.classList.add('active');
        }
        
        // Hide all articles
        contentArticles.forEach(article => article.classList.add('hidden'));
        
        // Show target article
        const targetId = this.getAttribute('href').substring(1);
        const targetArticle = document.getElementById(targetId);
        if (targetArticle) {
            targetArticle.classList.remove('hidden');
            currentArticleIndex = index;
            updateProgress();
            
            // Scroll to top of content
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});

// Handle section clicks (expand/collapse and show first article)
sectionLinks.forEach(section => {
    section.addEventListener('click', function() {
        // Remove active from all sections
        sectionLinks.forEach(s => s.classList.remove('active'));
        // Add active to clicked section
        this.classList.add('active');
        
        // Show first article of this section
        const firstArticle = this.parentElement.querySelector('.article-link');
        if (firstArticle) {
            firstArticle.click();
        }
    });
});

// Next button functionality
nextBtn.addEventListener('click', function() {
    if (currentArticleIndex < articleLinks.length - 1) {
        currentArticleIndex++;
        articleLinks[currentArticleIndex].click();
    } else {
        alert('You have completed all articles! 🎉');
        // Optionally reset to first article
        // currentArticleIndex = 0;
        // articleLinks[0].click();
    }
});

// Update progress indicator
function updateProgress() {
    const totalArticles = articleLinks.length;
    progressSpan.textContent = `Article ${currentArticleIndex + 1} of ${totalArticles}`;
    
    // Update button text if on last article
    if (currentArticleIndex === totalArticles - 1) {
        nextBtn.innerHTML = `
            Complete Reading
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
        `;
    } else {
        nextBtn.innerHTML = `
            Next Article
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
        `;
    }
}

// Initialize first article on page load
document.addEventListener('DOMContentLoaded', function() {
    if (articleLinks.length > 0) {
        articleLinks[0].classList.add('active');
        sectionLinks[0].classList.add('active');
        updateProgress();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Arrow key navigation
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentArticleIndex < articleLinks.length - 1) {
            currentArticleIndex++;
            articleLinks[currentArticleIndex].click();
        }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentArticleIndex > 0) {
            currentArticleIndex--;
            articleLinks[currentArticleIndex].click();
        }
    }
    
    // Space bar for next article
    else if (e.key === ' ') {
        e.preventDefault();
        nextBtn.click();
    }
    
    // Home key to go to first article
    else if (e.key === 'Home') {
        e.preventDefault();
        currentArticleIndex = 0;
        articleLinks[0].click();
    }
    
    // End key to go to last article
    else if (e.key === 'End') {
        e.preventDefault();
        currentArticleIndex = articleLinks.length - 1;
        articleLinks[currentArticleIndex].click();
    }
});

// Optional: Auto-save reading progress to localStorage
function saveProgress() {
    localStorage.setItem('readingProgress', currentArticleIndex);
}

function loadProgress() {
    const savedProgress = localStorage.getItem('readingProgress');
    if (savedProgress !== null) {
        const index = parseInt(savedProgress);
        if (index >= 0 && index < articleLinks.length) {
            currentArticleIndex = index;
            articleLinks[currentArticleIndex].click();
        }
    }
}

// Save progress when article changes
articleLinks.forEach(link => {
    link.addEventListener('click', saveProgress);
});

// Load progress on page load
document.addEventListener('DOMContentLoaded', function() {
    // Uncomment the next line if you want to auto-load saved progress
    // loadProgress();
});

// Optional: Reading time estimation
function estimateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
}

// Add reading time to articles (optional feature)
function addReadingTimes() {
    contentArticles.forEach(article => {
        const text = article.textContent;
        const readingTime = estimateReadingTime(text);
        const breadcrumb = article.querySelector('.text-blue-600');
        if (breadcrumb && readingTime > 0) {
            breadcrumb.textContent += ` • ${readingTime} min read`;
        }
    });
}

// Uncomment to enable reading time feature
// document.addEventListener('DOMContentLoaded', addReadingTimes);