/* ==========================================
   SECTION 4 - PROCESSUS WORKFLOW TIMELINE VERTICALE EIFJ
   Animations GSAP interactives pour timeline
   ========================================== */

// Initialisation GSAP
gsap.registerPlugin(ScrollTrigger);

class ProcessusTimeline {
    constructor() {
        this.timelineSteps = document.querySelectorAll('.timeline-step');
        this.timelineTrack = document.querySelector('.timeline-track');
        this.sectionHeader = document.querySelector('.section-header');
        this.garantiesSection = document.querySelector('.processus-garanties');
        
        this.init();
    }
    
    init() {
        this.animateHeader();
        this.animateTimelineTrack();
        this.animateTimelineSteps();
        this.setupHoverEffects();
        this.animateGaranties();
        this.setupCTAAnimations();
        this.setupCTAHandlers();
    }
    
    // Animation du header au scroll
    animateHeader() {
        const headerElements = [
            '.header-badge',
            '.section-title',
            '.section-subtitle',
            '.header-stats'
        ];
        
        headerElements.forEach((element, index) => {
            gsap.fromTo(element, 
                {
                    y: 50,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
        
        // Animation des stats avec compteur
        gsap.utils.toArray('.stat-number').forEach(stat => {
            const finalValue = stat.textContent;
            const numericValue = parseFloat(finalValue);
            
            ScrollTrigger.create({
                trigger: stat,
                start: "top 80%",
                onEnter: () => {
                    gsap.fromTo({ value: 0 }, {
                        value: numericValue,
                        duration: 1.5,
                        ease: "power2.out",
                        onUpdate: function() {
                            if (finalValue.includes('%')) {
                                stat.textContent = Math.round(this.targets()[0].value) + '%';
                            } else if (finalValue.includes('+')) {
                                stat.textContent = Math.round(this.targets()[0].value) + '+';
                            } else {
                                stat.textContent = Math.round(this.targets()[0].value);
                            }
                        }
                    });
                }
            });
        });
    }
    
    // Animation de la ligne timeline qui se dessine
    animateTimelineTrack() {
        // Initialiser la timeline en invisible
        gsap.set('.timeline-track', { 
            scaleX: 0, 
            transformOrigin: "left center",
            opacity: 0
        });
        
        gsap.set('.timeline-labels', { 
            opacity: 0, 
            y: -20 
        });
        
        // Animation fluide de la timeline
        ScrollTrigger.create({
            trigger: '.timeline-container',
            start: "top 85%",
            onEnter: () => {
                gsap.timeline()
                    .to('.timeline-labels', {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power2.out"
                    })
                    .to('.timeline-track', {
                        scaleX: 1,
                        opacity: 1,
                        duration: 1.2,
                        ease: "power2.out"
                    }, "-=0.3");
            },
            onLeaveBack: () => {
                gsap.to('.timeline-track', {
                    scaleX: 0,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power2.in"
                });
                gsap.to('.timeline-labels', {
                    opacity: 0,
                    y: -20,
                    duration: 0.4,
                    ease: "power2.in"
                });
            }
        });
    }
    
    // Animation des étapes timeline avec stagger fluide
    animateTimelineSteps() {
        // Initialiser tous les éléments en position invisible
        gsap.set(this.timelineSteps, { 
            opacity: 0, 
            y: 100,
            scale: 0.8
        });
        
        gsap.set('.step-point', { 
            scale: 0, 
            rotation: -90,
            opacity: 0
        });
        
        gsap.set('.point-glow', { 
            opacity: 0, 
            scale: 0.5 
        });
        
        // Timeline maître pour toute la section
        const masterTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.timeline-steps-grid',
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
        
        // Animation staggered des étapes avec fluidity maximale
        masterTimeline
            .to(this.timelineSteps, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                ease: "power2.out",
                stagger: {
                    amount: 0.8, // Délai plus long pour plus de fluidité
                    from: "start",
                    ease: "power2.out"
                }
            })
            .to('.step-point', {
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 0.8,
                ease: "elastic.out(1, 0.5)",
                stagger: {
                    amount: 0.6,
                    from: "start",
                    ease: "power1.out"
                }
            }, "-=0.6")
            .to('.point-glow', {
                opacity: 0.6,
                scale: 1.2,
                duration: 0.7,
                ease: "power2.out",
                stagger: {
                    amount: 0.4,
                    from: "start",
                    ease: "sine.out"
                }
            }, "-=0.4");
            
        // Animation des éléments internes (après l'animation principale)
        this.animateCardContents(masterTimeline);
    }
    
    // Animation des contenus internes des cards
    animateCardContents(masterTimeline) {
        // Initialiser tous les éléments internes
        gsap.set('.step-badge, .step-title, .step-subtitle, .step-description', { 
            opacity: 0, 
            y: 30 
        });
        
        gsap.set('.process-list li', { 
            opacity: 0, 
            x: -20 
        });
        
        gsap.set('.deliverable-tag', { 
            opacity: 0, 
            scale: 0.8,
            y: 10
        });
        
        gsap.set('.step-cta-button', { 
            opacity: 0, 
            y: 20,
            scale: 0.9
        });
        
        // Ajouter les animations fluides des contenus internes
        masterTimeline
            .to('.step-badge', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power1.out",
                stagger: {
                    amount: 0.4,
                    from: "start",
                    ease: "sine.out"
                }
            }, "-=0.4")
            .to('.step-title', {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power1.out",
                stagger: {
                    amount: 0.4,
                    from: "start",
                    ease: "sine.out"
                }
            }, "-=0.5")
            .to('.step-subtitle', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power1.out",
                stagger: {
                    amount: 0.4,
                    from: "start",
                    ease: "sine.out"
                }
            }, "-=0.5")
            .to('.step-description', {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power1.out",
                stagger: {
                    amount: 0.4,
                    from: "start",
                    ease: "sine.out"
                }
            }, "-=0.5")
            .to('.process-list li', {
                opacity: 1,
                x: 0,
                duration: 0.5,
                ease: "power1.out",
                stagger: {
                    amount: 1.2, // Plus fluide pour les listes
                    from: "start",
                    each: 0.08,
                    ease: "sine.out"
                }
            }, "-=0.4")
            .to('.deliverable-tag', {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.5,
                ease: "back.out(1.2)",
                stagger: {
                    amount: 0.8,
                    from: "start",
                    each: 0.06,
                    ease: "sine.out"
                }
            }, "-=0.6")
            .to('.step-cta-button', {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: "back.out(1.3)",
                stagger: {
                    amount: 0.4,
                    from: "start",
                    ease: "sine.out"
                }
            }, "-=0.4");
    }
    
    // Effets de hover interactifs
    setupHoverEffects() {
        this.timelineSteps.forEach(step => {
            const stepCard = step.querySelector('.step-card');
            const stepPoint = step.querySelector('.step-point');
            const pointGlow = step.querySelector('.point-glow');
            const ctaButton = step.querySelector('.step-cta-button');
            
            let hoverTl = gsap.timeline({ paused: true });
            
            hoverTl
                .to(stepCard, {
                    y: -15,
                    rotationX: 5,
                    rotationY: 2,
                    duration: 0.3,
                    ease: "power2.out"
                })
                .to(stepPoint, {
                    scale: 1.1,
                    duration: 0.3,
                    ease: "elastic.out(1, 0.3)"
                }, 0)
                .to(pointGlow, {
                    opacity: 1,
                    scale: 1.3,
                    duration: 0.3
                }, 0);
            
            stepCard.addEventListener('mouseenter', () => {
                hoverTl.play();
                
                // Animation spéciale pour le bouton CTA
                gsap.to(ctaButton, {
                    scale: 1.05,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });
            
            stepCard.addEventListener('mouseleave', () => {
                hoverTl.reverse();
                
                gsap.to(ctaButton, {
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });
            
            // Effet de parallax léger sur les cards
            ScrollTrigger.create({
                trigger: step,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress - 0.5;
                    gsap.set(stepCard, {
                        y: progress * 30,
                        rotationX: progress * 2
                    });
                }
            });
        });
        
        // Effet de particules sur hover des points
        this.timelineSteps.forEach(step => {
            const point = step.querySelector('.step-point');
            
            point.addEventListener('mouseenter', () => {
                this.createParticles(point);
            });
        });
    }
    
    // Création d'effet particules
    createParticles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: #4F46E5;
                border-radius: 50%;
                pointer-events: none;
                left: ${centerX}px;
                top: ${centerY}px;
                z-index: 9999;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            
            gsap.to(particle, {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                opacity: 0,
                scale: 0,
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => {
                    document.body.removeChild(particle);
                }
            });
        }
    }
    
    // Animation section garanties
    animateGaranties() {
        gsap.fromTo('.garanties-header',
            {
                y: 50,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: '.processus-garanties',
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
        
        // Animation stagger des garanties
        gsap.fromTo('.garantie-item',
            {
                y: 40,
                opacity: 0,
                scale: 0.8
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: '.garanties-grid',
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
        
        // Animation de la proof section
        gsap.fromTo('.processus-proof',
            {
                y: 60,
                opacity: 0,
                rotationX: -10
            },
            {
                y: 0,
                opacity: 1,
                rotationX: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: '.processus-proof',
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
        
        // Animation des métriques de proof avec compteur
        gsap.utils.toArray('.proof-metric .metric-number').forEach(metric => {
            const finalValue = metric.textContent;
            const numericValue = parseFloat(finalValue);
            
            ScrollTrigger.create({
                trigger: metric,
                start: "top 80%",
                onEnter: () => {
                    gsap.fromTo({ value: 0 }, {
                        value: numericValue,
                        duration: 2,
                        ease: "power2.out",
                        onUpdate: function() {
                            if (finalValue.includes('%')) {
                                metric.textContent = Math.round(this.targets()[0].value) + '%';
                            } else {
                                metric.textContent = Math.round(this.targets()[0].value);
                            }
                        }
                    });
                }
            });
        });
    }
    
    // Animations CTA
    setupCTAAnimations() {
        const ctaButton = document.querySelector('.cta-button-primary');
        
        // Animation d'entrée
        gsap.fromTo('.cta-final',
            {
                y: 50,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: '.cta-final',
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
        
        // Effet de pulsation subtile sur le CTA principal
        gsap.to(ctaButton, {
            scale: 1.02,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        // Effet hover amélioré
        if (ctaButton) {
            let ctaHoverTl = gsap.timeline({ paused: true });
            
            ctaHoverTl
                .to(ctaButton, {
                    y: -8,
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                })
                .to('.button-glow', {
                    opacity: 1,
                    duration: 0.3
                }, 0);
            
            ctaButton.addEventListener('mouseenter', () => {
                ctaHoverTl.play();
            });
            
            ctaButton.addEventListener('mouseleave', () => {
                ctaHoverTl.reverse();
            });
        }
    }
    
    // Gestion des clicks sur les CTA
    setupCTAHandlers() {
        const stepButtons = document.querySelectorAll('.step-cta-button');
        const mainCTA = document.querySelector('.cta-button-primary');
        
        stepButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Animation de click
                gsap.to(button, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                });
                
                // Ici vous pouvez ajouter la logique de redirection
                console.log('CTA étape cliqué:', button);
            });
        });
        
        if (mainCTA) {
            mainCTA.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Animation de click avec effet ripple
                gsap.to(mainCTA, {
                    scale: 0.98,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.inOut"
                });
                
                console.log('CTA principal cliqué');
            });
        }
    }
}

// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Petit délai pour s'assurer que GSAP est chargé
    setTimeout(() => {
        new ProcessusTimeline();
    }, 100);
});

// Refresh ScrollTrigger sur resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

// Performance : Pause animations quand l'onglet n'est pas visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.play();
    }
});