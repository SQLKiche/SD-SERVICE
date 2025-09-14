/* 🚀 SECTION 2 - SERVICES AUTOMATION - JAVASCRIPT */

/**
 * Stack Cards avec déclenchement au scroll
 * Gère l'apparition progressive des cartes selon le scroll
 */
function initStackCards() {
    const cards = document.querySelectorAll('.card-wrapper');
    console.log('🎴 Cartes services trouvées:', cards.length);
    
    if (cards.length === 0) {
        console.warn('⚠️ Aucune carte service trouvée');
        return;
    }
    
    function checkScroll() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const servicesSection = document.querySelector('.services');
        
        if (!servicesSection) return;
        
        const sectionTop = servicesSection.offsetTop;
        const basePoint = sectionTop + (windowHeight * 0.1);
        
        cards.forEach((card, index) => {
            // Calcul du point de déclenchement pour chaque carte
            const triggerPoint = basePoint + (index * windowHeight * 0.35);
            const resetPoint = triggerPoint - (windowHeight * 0.15);
            const previewPoint = triggerPoint - (windowHeight * 0.08);
            
            if (scrolled >= triggerPoint) {
                card.classList.add('visible');
                card.style.opacity = '1';
                console.log(`✅ Carte ${index + 1} visible`);
            } else if (scrolled >= previewPoint) {
                // Effet de prévisualisation
                const progress = (scrolled - previewPoint) / (triggerPoint - previewPoint);
                card.style.opacity = Math.min(0.6, 0.2 + progress * 0.4);
                card.classList.remove('visible');
            } else if (scrolled < resetPoint && index > 0) {
                // Reset la carte si on remonte (sauf la première)
                card.classList.remove('visible');
                card.style.opacity = '0';
            }
        });
    }
    
    // Event listener avec throttling pour performance
    let ticking = false;
    function optimizedScrollHandler() {
        if (!ticking) {
            requestAnimationFrame(() => {
                checkScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', optimizedScrollHandler);
    checkScroll(); // Check initial state
    
    console.log('✅ Stack Cards initialisé');
}

/**
 * Gestion des boutons CTA de services
 * Capture les clics sur les boutons "Discuter de mon projet"
 */
function initServiceCTA() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        const service = button.getAttribute('data-service');
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Analytics / tracking
            console.log(`🎯 CTA Service cliqué: ${service}`);
            
            // Animation feedback
            button.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                button.style.transform = '';
            }, 200);
            
            // Actions selon le service
            handleServiceCTA(service, button);
        });
        
        // Hover effects améliorés
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });
    
    console.log(`✅ ${ctaButtons.length} boutons CTA services initialisés`);
}

/**
 * Gestion spécifique par type de service
 * Redirige ou ouvre les modales selon le service
 */
function handleServiceCTA(service, button) {
    const serviceData = {
        audit: {
            name: 'Audit Découverte',
            price: '250€',
            duration: '2 jours'
        },
        automation: {
            name: 'Automatisation Simple',
            price: '500€',
            duration: '3-5 jours'
        },
        powerbi: {
            name: 'Dashboard Power BI',
            price: '800€',
            duration: '5-7 jours'
        },
        ia: {
            name: 'Assistant IA Basique',
            price: '600€',
            duration: '2-4 jours'
        }
    };
    
    const currentService = serviceData[service];
    if (!currentService) return;
    
    // Pour l'instant, log l'action - à remplacer par vraie action
    console.log(`📋 Service sélectionné:`, currentService);
    
    // TODO: Remplacer par une vraie action
    // Exemples possibles:
    // - Ouvrir formulaire de contact pré-rempli
    // - Rediriger vers Calendly avec service pré-sélectionné
    // - Ouvrir modal avec détails + formulaire
    // - Scroll vers section contact
    
    // Exemple notification temporaire
    showServiceNotification(currentService);
}

/**
 * Notification temporaire pour feedback utilisateur
 * TODO: Remplacer par vraie intégration
 */
function showServiceNotification(service) {
    const notification = document.createElement('div');
    notification.className = 'service-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <strong>${service.name}</strong> sélectionné
            <p>Prix: ${service.price} • Durée: ${service.duration}</p>
            <small>Contactez-moi pour discuter de votre projet!</small>
        </div>
    `;
    
    // Styles inline temporaires
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: 'rgba(79, 70, 229, 0.95)',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '12px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3)',
        zIndex: '9999',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px'
    });
    
    document.body.appendChild(notification);
    
    // Animation d'apparition
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remove après 4 secondes
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

/**
 * Optimisation vidéos pour performance
 * Gère le lazy loading et les erreurs des vidéos de cards
 */
function initVideoOptimization() {
    const cardVideos = document.querySelectorAll('.card-video');
    
    if (cardVideos.length === 0) return;
    
    // Intersection Observer pour lazy loading
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                
                // Démarrer la vidéo si pas déjà en cours
                video.play().catch(error => {
                    console.warn('⚠️ Autoplay vidéo bloqué pour:', video.src);
                });
                
                videoObserver.unobserve(video);
            }
        });
    }, { threshold: 0.25 });
    
    cardVideos.forEach(video => {
        // Observer pour lazy loading
        videoObserver.observe(video);
        
        // Gestion des erreurs
        video.addEventListener('error', (e) => {
            console.error('❌ Erreur chargement vidéo carte:', video.src);
            video.style.display = 'none';
        });
        
        // Optimisation: pause quand pas visible
        video.addEventListener('loadeddata', () => {
            if (!video.closest('.card-wrapper').classList.contains('visible')) {
                video.pause();
            }
        });
    });
    
    console.log(`✅ ${cardVideos.length} vidéos optimisées`);
}

/**
 * Animation d'apparition de la section
 * Anime les éléments du header de section
 */
function initSectionAnimations() {
    const sectionHeader = document.querySelector('.section-header');
    const guarantee = document.querySelector('.guarantee');
    
    const elements = [
        { element: sectionHeader, delay: 0 },
        { element: guarantee, delay: 200 }
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
    
    console.log('✅ Animations de section initialisées');
}

/**
 * Responsive adaptations
 * Ajustements dynamiques pour mobile
 */
function initResponsiveAdaptations() {
    function checkViewport() {
        const isMobile = window.innerWidth <= 768;
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            if (isMobile) {
                card.style.padding = 'var(--space-2xl) var(--space-lg)';
            } else {
                card.style.padding = 'var(--space-4xl)';
            }
        });
    }
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    
    console.log('✅ Adaptations responsive initialisées');
}

/**
 * Initialisation principale de la section 2
 * Lance toutes les fonctionnalités des services
 */
function initSection2() {
    // Vérifier que le DOM est chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSection2);
        return;
    }
    
    try {
        initStackCards();
        initServiceCTA();
        initVideoOptimization();
        initSectionAnimations();
        initResponsiveAdaptations();
        
        console.log('🎯 Section 2 (Services Automation) initialisée avec succès!');
    } catch (error) {
        console.error('❌ Erreur initialisation Section 2:', error);
    }
}

// Auto-initialisation
initSection2();