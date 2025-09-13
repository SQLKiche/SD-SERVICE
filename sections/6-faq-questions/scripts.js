/* 🚀 SECTION 6 - FAQ QUESTIONS - JAVASCRIPT */

/**
 * FAQ Section avec accordéon interactif
 * Gère l'ouverture/fermeture des questions et animations
 */
class FAQQuestions {
    constructor() {
        this.faqItems = [];
        this.activeIndex = null;
        this.observer = null;
        
        this.init();
    }
    
    init() {
        console.log('🎯 Initialisation FAQ Questions');
        this.setupElements();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.animateOnLoad();
    }
    
    setupElements() {
        this.faqItems = document.querySelectorAll('.faq-item');
        console.log(`❓ ${this.faqItems.length} questions FAQ trouvées`);
        
        // Initialiser l'état des réponses
        this.faqItems.forEach(item => {
            const answer = item.querySelector('.faq-answer');
            if (answer) {
                answer.style.maxHeight = '0px';
            }
        });
    }
    
    setupEventListeners() {
        this.faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question');
            
            if (question) {
                // Click event
                question.addEventListener('click', () => {
                    this.toggleFAQ(index);
                });
                
                // Keyboard events pour l'accessibilité
                question.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleFAQ(index);
                    }
                });
                
                // Hover effects
                question.addEventListener('mouseenter', () => {
                    this.addHoverEffect(item);
                });
                
                question.addEventListener('mouseleave', () => {
                    this.removeHoverEffect(item);
                });
            }
        });
        
        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeIndex !== null) {
                this.closeFAQ(this.activeIndex);
            }
        });
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateFAQItem(entry.target);
                }
            });
        }, observerOptions);
        
        // Observer chaque item FAQ
        this.faqItems.forEach(item => {
            this.observer.observe(item);
        });
    }
    
    toggleFAQ(index) {
        const item = this.faqItems[index];
        const isActive = item.classList.contains('active');
        
        if (isActive) {
            this.closeFAQ(index);
        } else {
            // Fermer les autres FAQ ouvertes (optionnel - mode accordéon unique)
            if (this.activeIndex !== null && this.activeIndex !== index) {
                this.closeFAQ(this.activeIndex);
            }
            
            this.openFAQ(index);
        }
    }
    
    openFAQ(index) {
        const item = this.faqItems[index];
        const answer = item.querySelector('.faq-answer');
        const content = item.querySelector('.faq-answer-content');
        const question = item.querySelector('.faq-question');
        
        if (!item || !answer || !content) return;
        
        // Marquer comme actif
        item.classList.add('active');
        this.activeIndex = index;
        
        // Mettre à jour l'aria-expanded
        question.setAttribute('aria-expanded', 'true');
        
        // Calculer la hauteur nécessaire
        const contentHeight = content.scrollHeight;
        
        // Animation d'ouverture
        answer.style.maxHeight = `${contentHeight + 60}px`; // +60 pour le padding
        
        // Animer le contenu
        setTimeout(() => {
            content.style.transform = 'translateY(0)';
            content.style.opacity = '1';
        }, 150);
        
        // Ajouter classe pour animations CSS
        answer.classList.add('expanding');
        setTimeout(() => {
            answer.classList.remove('expanding');
        }, 400);
        
        console.log(`✅ FAQ ${index + 1} ouverte`);
        
        // Analytics ou tracking (optionnel)
        this.trackFAQOpen(index);
    }
    
    closeFAQ(index) {
        const item = this.faqItems[index];
        const answer = item.querySelector('.faq-answer');
        const content = item.querySelector('.faq-answer-content');
        const question = item.querySelector('.faq-question');
        
        if (!item || !answer || !content) return;
        
        // Animer le contenu d'abord
        content.style.transform = 'translateY(-20px)';
        content.style.opacity = '0';
        
        // Fermer après l'animation du contenu
        setTimeout(() => {
            answer.style.maxHeight = '0px';
            item.classList.remove('active');
            
            if (this.activeIndex === index) {
                this.activeIndex = null;
            }
            
            // Mettre à jour l'aria-expanded
            question.setAttribute('aria-expanded', 'false');
        }, 150);
        
        // Ajouter classe pour animations CSS
        answer.classList.add('collapsing');
        setTimeout(() => {
            answer.classList.remove('collapsing');
        }, 400);
        
        console.log(`❌ FAQ ${index + 1} fermée`);
    }
    
    animateFAQItem(item) {
        if (item.classList.contains('visible')) return;
        
        const index = Array.from(this.faqItems).indexOf(item);
        
        setTimeout(() => {
            item.classList.add('visible');
            item.classList.add('animate-in');
            
            // Effet de "bounce" subtil
            setTimeout(() => {
                item.style.transform = 'translateY(-5px)';
                setTimeout(() => {
                    item.style.transform = 'translateY(0)';
                    item.classList.remove('animate-in');
                }, 200);
            }, 300);
            
        }, index * 100); // Délai progressif
        
        console.log(`🎬 FAQ item ${index + 1} animé`);
    }
    
    addHoverEffect(item) {
        const icon = item.querySelector('.faq-icon');
        if (icon && !item.classList.contains('active')) {
            icon.style.transform = 'scale(1.1)';
            icon.style.color = 'var(--secondary-cyan)';
        }
    }
    
    removeHoverEffect(item) {
        const icon = item.querySelector('.faq-icon');
        if (icon && !item.classList.contains('active')) {
            icon.style.transform = 'scale(1)';
            icon.style.color = 'var(--primary-blue)';
        }
    }
    
    animateOnLoad() {
        // Animation d'entrée du header
        const header = document.querySelector('.faq-header');
        if (header) {
            header.style.opacity = '0';
            header.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                header.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
            }, 200);
        }
        
        // Animation du CTA final
        const cta = document.querySelector('.faq-cta');
        if (cta) {
            cta.style.opacity = '0';
            cta.style.transform = 'translateY(40px)';
            
            setTimeout(() => {
                cta.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                cta.style.opacity = '1';
                cta.style.transform = 'translateY(0)';
            }, 1000);
        }
    }
    
    trackFAQOpen(index) {
        // Tracking pour analytics (optionnel)
        const faqQuestion = this.faqItems[index]?.querySelector('h3')?.textContent;
        
        // Exemple avec Google Analytics (décommenter si nécessaire)
        /*
        if (typeof gtag !== 'undefined') {
            gtag('event', 'faq_open', {
                'event_category': 'FAQ',
                'event_label': faqQuestion,
                'value': index + 1
            });
        }
        */
        
        console.log(`📊 FAQ tracking: Question ${index + 1} - "${faqQuestion}"`);
    }
    
    // Méthodes utilitaires publiques
    openAllFAQ() {
        this.faqItems.forEach((item, index) => {
            if (!item.classList.contains('active')) {
                this.openFAQ(index);
            }
        });
    }
    
    closeAllFAQ() {
        this.faqItems.forEach((item, index) => {
            if (item.classList.contains('active')) {
                this.closeFAQ(index);
            }
        });
    }
    
    searchFAQ(searchTerm) {
        // Fonction de recherche dans les FAQ
        const results = [];
        
        this.faqItems.forEach((item, index) => {
            const question = item.querySelector('h3')?.textContent || '';
            const answer = item.querySelector('.faq-answer-content')?.textContent || '';
            
            if (question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                answer.toLowerCase().includes(searchTerm.toLowerCase())) {
                results.push(index);
            }
        });
        
        return results;
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

/**
 * Fonctions d'amélioration UX
 */
function addSmoothScrollToFAQ() {
    // Ajouter le smooth scroll vers les FAQ depuis des liens
    const faqLinks = document.querySelectorAll('a[href^="#faq"]');
    
    faqLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function addFAQSearch() {
    // Ajouter une barre de recherche FAQ (optionnel)
    const faqContainer = document.querySelector('.faq-container');
    if (!faqContainer) return;
    
    const searchHTML = `
        <div class="faq-search">
            <input type="text" placeholder="Rechercher dans les FAQ..." id="faqSearchInput">
            <button id="faqSearchClear">✕</button>
        </div>
    `;
    
    faqContainer.insertAdjacentHTML('beforebegin', searchHTML);
    
    const searchInput = document.getElementById('faqSearchInput');
    const clearBtn = document.getElementById('faqSearchClear');
    
    searchInput?.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        if (window.faqQuestions) {
            const results = window.faqQuestions.searchFAQ(searchTerm);
            // Implémenter la logique de filtrage visuel
        }
    });
    
    clearBtn?.addEventListener('click', () => {
        searchInput.value = '';
        // Réafficher toutes les FAQ
    });
}

/**
 * Initialisation au chargement de la page
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation Section FAQ Questions');
    
    // Créer l'instance principale
    window.faqQuestions = new FAQQuestions();
    
    // Ajouter les améliorations UX
    setTimeout(() => {
        addSmoothScrollToFAQ();
        // addFAQSearch(); // Décommenter pour ajouter la recherche
    }, 500);
    
    // Cleanup au déchargement
    window.addEventListener('beforeunload', () => {
        if (window.faqQuestions) {
            window.faqQuestions.destroy();
        }
    });
    
    console.log('✅ FAQ Questions initialisé avec succès');
});
