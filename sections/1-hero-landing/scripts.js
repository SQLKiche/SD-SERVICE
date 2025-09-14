/* 🚀 SECTION 1 - HEADER + HERO LANDING - JAVASCRIPT */

/**
 * Header scroll effect - Compact navigation
 * Affiche/masque la navigation compacte selon le scroll
 */
function initHeaderScroll() {
    const header = document.getElementById('mainHeader');
    const compactNav = document.getElementById('compactNav');
    
    if (!header || !compactNav) {
        console.warn('⚠️ Header ou Compact Nav non trouvé');
        return;
    }
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Afficher compact nav après 200px de scroll
        if (currentScrollY > 200) {
            compactNav.classList.add('visible');
        } else {
            compactNav.classList.remove('visible');
        }
    });
    
    console.log('✅ Header scroll effect initialisé');
}

/**
 * Smooth scroll pour les liens de navigation
 * Gère les clics sur les liens de navigation
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.compact-nav-item[href^="#"], .nav-item[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = 80; // Hauteur du header fixe
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    console.log('✅ Smooth scroll initialisé');
}

/**
 * Animation des éléments hero au chargement
 * Anime le titre et les boutons avec un délai séquentiel
 */
function initHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    
    // Animation séquentielle avec délais
    const elements = [
        { element: heroTitle, delay: 100 },
        { element: heroSubtitle, delay: 300 },
        { element: heroButtons, delay: 500 }
    ];
    
    elements.forEach(({ element, delay }) => {
        if (element) {
            // État initial
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Animation avec délai
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay);
        }
    });
    
    console.log('✅ Hero animations initialisées');
}

/**
 * Gestion des boutons CTA
 * Actions sur les boutons call-to-action
 */
function initCTAButtons() {
    const primaryCTA = document.querySelector('.btn-primary');
    const secondaryCTA = document.querySelector('.btn-secondary');
    const getStartedBtn = document.querySelector('.get-started-btn');
    
    // Button "Commencer l'automatisation"
    if (primaryCTA) {
        primaryCTA.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🚀 CTA Primary cliqué - Commencer automatisation');
            // TODO: Rediriger vers section services ou formulaire contact
        });
    }
    
    // Button "Obtenir un audit"
    if (secondaryCTA) {
        secondaryCTA.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('📋 CTA Secondary cliqué - Obtenir audit');
            // TODO: Rediriger vers formulaire audit ou calendly
        });
    }
    
    // Button header "Démarrer"
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('⚡ Get Started cliqué - Header');
            // TODO: Rediriger vers section contact
        });
    }
    
    console.log('✅ CTA Buttons initialisés');
}

/**
 * Performance optimization pour la vidéo
 * Gère le chargement et la lecture de la vidéo background
 */
function initVideoOptimization() {
    const heroVideo = document.querySelector('.hero-video');
    
    if (!heroVideo) return;
    
    // Observer pour lazy loading de la vidéo si pas visible
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Vidéo visible - s'assurer qu'elle joue
                heroVideo.play().catch(error => {
                    console.warn('⚠️ Autoplay vidéo bloqué:', error);
                });
                videoObserver.unobserve(heroVideo);
            }
        });
    });
    
    videoObserver.observe(heroVideo);
    
    // Gérer les erreurs de chargement vidéo
    heroVideo.addEventListener('error', (e) => {
        console.error('❌ Erreur chargement vidéo:', e);
        // Fallback: masquer la vidéo, garder seulement l'overlay
        heroVideo.style.display = 'none';
    });
    
    console.log('✅ Video optimization initialisée');
}

/**
 * Responsive navigation mobile
 * Gestion du menu mobile (si ajouté plus tard)
 */
function initMobileNavigation() {
    // TODO: Implémenter burger menu pour mobile si nécessaire
    console.log('📱 Mobile navigation prête (à implémenter si besoin)');
}

/**
 * Initialisation principale
 * Lance toutes les fonctionnalités de la section 1
 */
function initSection1() {
    // Vérifier que le DOM est chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSection1);
        return;
    }
    
    try {
        initHeaderScroll();
        initSmoothScroll();
        initHeroAnimations();
        initCTAButtons();
        initVideoOptimization();
        initMobileNavigation();
        
        console.log('🎯 Section 1 (Header + Hero Landing) initialisée avec succès!');
    } catch (error) {
        console.error('❌ Erreur initialisation Section 1:', error);
    }
}

// Auto-initialisation
initSection1();