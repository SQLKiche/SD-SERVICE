/* 🚀 SECTION 5 - ABOUT CRÉDIBILITÉ - JAVASCRIPT */

/**
 * About Section avec animations de compétences et timeline
 * Gère les barres de progression et animations d'apparition
 */
class AboutCredibilite {
    constructor() {
        this.skillBars = [];
        this.animatedElements = [];
        this.observer = null;
        
        this.init();
    }
    
    init() {
        console.log('🎯 Initialisation About Crédibilité');
        this.setupElements();
        this.setupIntersectionObserver();
        this.animateOnLoad();
    }
    
    setupElements() {
        // Récupérer les barres de compétences
        this.skillBars = document.querySelectorAll('.skill-bar');
        
        // Récupérer tous les éléments à animer
        this.animatedElements = [
            ...document.querySelectorAll('.skill-category'),
            ...document.querySelectorAll('.experience-item'),
            ...document.querySelectorAll('.differentiator-card')
        ];
        
        console.log(`📊 ${this.skillBars.length} barres de compétences trouvées`);
        console.log(`🎬 ${this.animatedElements.length} éléments à animer`);
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);
        
        // Observer les catégories de compétences pour les barres
        document.querySelectorAll('.skill-category').forEach(category => {
            this.observer.observe(category);
        });
        
        // Observer les autres éléments
        this.animatedElements.forEach(element => {
            this.observer.observe(element);
        });
    }
    
    animateElement(element) {
        if (element.classList.contains('skill-category')) {
            this.animateSkillCategory(element);
        } else if (element.classList.contains('experience-item')) {
            this.animateExperienceItem(element);
        } else if (element.classList.contains('differentiator-card')) {
            this.animateDifferentiatorCard(element);
        }
    }
    
    animateSkillCategory(category) {
        // Animation de la catégorie
        category.style.opacity = '0';
        category.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            category.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            category.style.opacity = '1';
            category.style.transform = 'translateY(0)';
        }, 100);
        
        // Animation des barres de compétences
        const skillBars = category.querySelectorAll('.skill-bar');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                this.animateSkillBar(bar);
            }, 300 + (index * 200));
        });
        
        console.log(`📊 Catégorie de compétences animée`);
    }
    
    animateSkillBar(bar) {
        const level = bar.getAttribute('data-level');
        if (!level) return;
        
        // Animation de la barre de progression
        bar.style.setProperty('--target-width', `${level}%`);
        bar.classList.add('animated');
        
        // Animation du pourcentage (optionnel - peut être ajouté)
        this.animateCounter(bar, 0, parseInt(level), 1500);
    }
    
    animateCounter(element, start, end, duration) {
        // Animation compteur pour les pourcentages
        let startTime = null;
        
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            
            // Ajouter un badge de pourcentage si souhaité
            // element.setAttribute('data-percentage', `${current}%`);
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        
        requestAnimationFrame(step);
    }
    
    animateExperienceItem(item) {
        // Animation des éléments d'expérience
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100);
        
        // Animation des tags technologiques
        const techTags = item.querySelectorAll('.tech-tag');
        techTags.forEach((tag, index) => {
            tag.style.opacity = '0';
            tag.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                tag.style.transition = 'all 0.3s ease';
                tag.style.opacity = '1';
                tag.style.transform = 'scale(1)';
            }, 400 + (index * 100));
        });
        
        console.log(`💼 Expérience animée`);
    }
    
    animateDifferentiatorCard(card) {
        // Animation des cartes différenciatrices
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
        
        // Animation de l'icône
        const icon = card.querySelector('.differentiator-icon');
        if (icon) {
            setTimeout(() => {
                icon.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    icon.style.transition = 'transform 0.3s ease';
                    icon.style.transform = 'scale(1)';
                }, 200);
            }, 300);
        }
        
        console.log(`🎯 Différenciateur animé`);
    }
    
    animateOnLoad() {
        // Animation d'entrée de l'introduction
        const intro = document.querySelector('.about-intro');
        if (intro) {
            intro.style.opacity = '0';
            intro.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                intro.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                intro.style.opacity = '1';
                intro.style.transform = 'translateY(0)';
            }, 200);
        }
        
        // Animation de l'avatar
        this.animateProfileAvatar();
    }
    
    animateProfileAvatar() {
        const avatar = document.querySelector('.profile-avatar');
        if (!avatar) return;
        
        // Animation de rotation subtile de l'avatar
        let rotation = 0;
        const rotateAvatar = () => {
            rotation += 0.5;
            avatar.style.transform = `rotate(${Math.sin(rotation * 0.01) * 5}deg)`;
            requestAnimationFrame(rotateAvatar);
        };
        
        // Démarrer l'animation après un délai
        setTimeout(() => {
            rotateAvatar();
        }, 1000);
        
        // Effet hover sur l'avatar
        avatar.addEventListener('mouseenter', () => {
            avatar.style.transform = 'scale(1.1)';
            avatar.style.boxShadow = '0 15px 40px rgba(79, 70, 229, 0.5)';
        });
        
        avatar.addEventListener('mouseleave', () => {
            avatar.style.transform = 'scale(1)';
            avatar.style.boxShadow = '0 10px 30px rgba(79, 70, 229, 0.3)';
        });
    }
    
    // Méthodes d'interaction avancées
    addSkillHoverEffects() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            const skillBar = item.querySelector('.skill-bar');
            
            item.addEventListener('mouseenter', () => {
                if (skillBar && skillBar.classList.contains('animated')) {
                    skillBar.style.filter = 'brightness(1.2) saturate(1.3)';
                    skillBar.style.transform = 'scaleY(1.2)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (skillBar) {
                    skillBar.style.filter = 'brightness(1) saturate(1)';
                    skillBar.style.transform = 'scaleY(1)';
                }
            });
        });
    }
    
    addExperienceHoverEffects() {
        const experienceItems = document.querySelectorAll('.experience-item');
        
        experienceItems.forEach(item => {
            const content = item.querySelector('.experience-content');
            
            item.addEventListener('mouseenter', () => {
                content.style.transform = 'scale(1.02)';
                content.style.boxShadow = '0 25px 60px rgba(79, 70, 229, 0.2)';
            });
            
            item.addEventListener('mouseleave', () => {
                content.style.transform = 'scale(1)';
                content.style.boxShadow = '';
            });
        });
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

/**
 * Fonctions utilitaires pour les animations
 */
function addParallaxEffect() {
    // Effet parallaxe subtil sur les sections
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const sections = document.querySelectorAll('.skills-section, .experience-section, .differentiators-section');
        
        sections.forEach((section, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            section.style.transform = `translateY(${yPos}px)`;
        });
    });
}

function addTypewriterEffect() {
    // Effet machine à écrire sur le titre principal (optionnel)
    const title = document.querySelector('.about-title');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    title.style.borderRight = '3px solid var(--primary-blue)';
    
    let index = 0;
    const typeWriter = () => {
        if (index < text.length) {
            title.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 100);
        } else {
            // Faire clignoter le curseur
            setTimeout(() => {
                title.style.borderRight = 'none';
            }, 1000);
        }
    };
    
    // Démarrer après un délai
    setTimeout(typeWriter, 500);
}

/**
 * Initialisation au chargement de la page
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation Section About Crédibilité');
    
    // Créer l'instance principale
    window.aboutCredibilite = new AboutCredibilite();
    
    // Ajouter les effets d'amélioration UX
    setTimeout(() => {
        window.aboutCredibilite.addSkillHoverEffects();
        window.aboutCredibilite.addExperienceHoverEffects();
        // addParallaxEffect(); // Décommenter pour l'effet parallaxe
        // addTypewriterEffect(); // Décommenter pour l'effet machine à écrire
    }, 1000);
    
    // Cleanup au déchargement
    window.addEventListener('beforeunload', () => {
        if (window.aboutCredibilite) {
            window.aboutCredibilite.destroy();
        }
    });
    
    console.log('✅ About Crédibilité initialisé avec succès');
});
