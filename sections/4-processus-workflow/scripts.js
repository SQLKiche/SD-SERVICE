/* 🚀 SECTION 4 - PROCESSUS WORKFLOW - TIMELINE INTERACTIVE PREMIUM */

/**
 * Timeline Interactive Premium
 * - Progress bar animée au scroll
 * - Étapes expandables avec animations
 * - Navigation cliquable
 * - Micro-interactions premium
 */
class TimelineInteractive {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.isAnimating = false;
        this.scrollTriggers = [];
        
        this.init();
    }
    
    init() {
        console.log('🎯 Initialisation Timeline Interactive Premium');
        this.setupElements();
        this.setupProgressBar();
        this.setupExpandableSteps();
        this.setupScrollAnimations();
        this.setupNavigationEvents();
        this.animateOnLoad();
    }
    
    setupElements() {
        // Éléments principaux
        this.progressBar = document.getElementById('processusProgressBar');
        this.progressSteps = document.querySelectorAll('.progress-step');
        this.timelineSteps = document.querySelectorAll('.processus-step');
        this.proofSection = document.querySelector('.processus-proof');
        this.ctaSection = document.querySelector('.processus-cta');
        
        console.log(`📋 ${this.timelineSteps.length} étapes trouvées`);
    }
    
    setupProgressBar() {
        // Animation de la progress bar au scroll
        if (!this.progressBar) return;
        
        // Initialiser à 25% (étape 1 active)
        this.updateProgressBar(1);
        
        // Shimmer effect continu
        this.addProgressBarShimmer();
    }
    
    updateProgressBar(step) {
        if (!this.progressBar) return;
        
        const progress = (step / this.totalSteps) * 100;
        this.progressBar.style.width = `${progress}%`;
        
        // Mettre à jour les markers
        this.progressSteps.forEach((marker, index) => {
            if (index + 1 <= step) {
                marker.classList.add('active');
            } else {
                marker.classList.remove('active');
            }
        });
    }
    
    addProgressBarShimmer() {
        // L'effet shimmer est déjà en CSS, on peut ajouter des variations
        setInterval(() => {
            if (this.progressBar) {
                this.progressBar.style.animationDuration = `${1.5 + Math.random()}s`;
            }
        }, 3000);
    }
    
    setupExpandableSteps() {
        this.timelineSteps.forEach((step, index) => {
            const stepHeader = step.querySelector('.step-header');
            if (!stepHeader) return;
            
            // Rendre les headers cliquables
            stepHeader.style.cursor = 'pointer';
            stepHeader.addEventListener('click', () => {
                this.toggleStep(index + 1);
            });
            
            // Initialiser les états
            if (index === 0) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    toggleStep(stepNumber) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const step = this.timelineSteps[stepNumber - 1];
        
        // Fermer toutes les autres étapes
        this.timelineSteps.forEach((otherStep, index) => {
            if (index + 1 !== stepNumber) {
                otherStep.classList.remove('active');
                this.animateStepClose(otherStep);
            }
        });
        
        // Ouvrir/fermer l'étape cliquée
        const isCurrentlyActive = step.classList.contains('active');
        
        if (isCurrentlyActive) {
            step.classList.remove('active');
            this.animateStepClose(step);
        } else {
            step.classList.add('active');
            this.animateStepOpen(step);
            this.currentStep = stepNumber;
            this.updateProgressBar(stepNumber);
        }
        
        // Smooth scroll vers l'étape
        step.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }
    
    animateStepOpen(step) {
        // Animation d'ouverture avec GSAP si disponible
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(step.querySelectorAll('.step-content > *:not(.step-header)'), {
                opacity: 0,
                y: 20,
                scale: 0.95
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: \"power2.out\"
            });
            
            // Animer l'étape elle-même
            gsap.to(step, {
                borderColor: 'var(--primary-blue)',
                boxShadow: '0 25px 80px rgba(79, 70, 229, 0.2)',
                duration: 0.4,
                ease: \"power2.out\"
            });
        } else {
            // Fallback CSS
            step.style.borderColor = 'var(--primary-blue)';
            step.style.boxShadow = '0 25px 80px rgba(79, 70, 229, 0.2)';
        }
        
        // Animer le numéro de l'étape
        const stepNumber = step.querySelector('.step-number');
        if (stepNumber && typeof gsap !== 'undefined') {
            gsap.to(stepNumber, {
                scale: 1.1,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: \"power2.inOut\"
            });
        }
        
        // Micro-interactions sur les éléments
        this.addStepMicroInteractions(step);
    }
    
    animateStepClose(step) {
        if (typeof gsap !== 'undefined') {
            gsap.to(step, {
                borderColor: 'rgba(255, 255, 255, 0.08)',
                boxShadow: 'none',
                duration: 0.3,
                ease: \"power2.out\"
            });
        } else {
            step.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            step.style.boxShadow = 'none';
        }
    }
    
    addStepMicroInteractions(step) {
        // Animer les items de liste avec délai
        const listItems = step.querySelectorAll('.step-details li');
        listItems.forEach((item, index) => {
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(item, {
                    opacity: 0,
                    x: -20
                }, {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    delay: 0.2 + (index * 0.1),
                    ease: \"power2.out\"
                });
            }
        });
        
        // Animer le CTA button
        const ctaButton = step.querySelector('.cta-step-button');
        if (ctaButton) {
            setTimeout(() => {
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(ctaButton, {
                        opacity: 0,
                        scale: 0.9
                    }, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        ease: \"back.out(1.7)\"
                    });
                }
            }, 400);
        }
    }
    
    setupScrollAnimations() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            this.setupGSAPAnimations();
        } else {
            this.setupVanillaScrollAnimations();
        }
    }
    
    setupGSAPAnimations() {
        // Animation d'entrée des étapes
        this.timelineSteps.forEach((step, index) => {
            const trigger = ScrollTrigger.create({
                trigger: step,
                start: \"top 80%\",
                end: \"bottom 20%\",
                onEnter: () => {
                    gsap.fromTo(step, {
                        opacity: 0,
                        y: 50
                    }, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        delay: index * 0.2,
                        ease: \"power2.out\"
                    });
                },
                once: true
            });
            
            this.scrollTriggers.push(trigger);
        });
        
        // Animation de la section proof
        if (this.proofSection) {
            ScrollTrigger.create({
                trigger: this.proofSection,
                start: \"top 80%\",
                onEnter: () => {
                    gsap.fromTo(this.proofSection.querySelectorAll('.proof-metric'), {
                        opacity: 0,
                        scale: 0.8
                    }, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        stagger: 0.2,
                        ease: \"back.out(1.7)\"
                    });
                },
                once: true
            });
        }
        
        // Animation progress bar selon scroll
        ScrollTrigger.create({
            trigger: '.processus-timeline',
            start: \"top 80%\",
            end: \"bottom 20%\",
            onUpdate: (self) => {
                const progress = self.progress;
                const step = Math.ceil(progress * this.totalSteps);
                if (step !== this.currentStep && step > 0 && step <= this.totalSteps) {
                    this.updateProgressBar(step);
                }
            }
        });
    }
    
    setupVanillaScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animation spéciale pour les métriques
                    if (entry.target.classList.contains('proof-metric')) {
                        this.animateMetric(entry.target);
                    }
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '-50px 0px'
        });
        
        // Observer les étapes
        this.timelineSteps.forEach(step => {
            observer.observe(step);
        });
        
        // Observer les métriques proof
        if (this.proofSection) {
            const metrics = this.proofSection.querySelectorAll('.proof-metric');
            metrics.forEach(metric => observer.observe(metric));
        }
    }
    
    animateMetric(metric) {
        const number = metric.querySelector('.metric-number');
        if (!number) return;
        
        const finalValue = parseInt(number.textContent);
        const isPercentage = number.textContent.includes('%');
        let currentValue = 0;
        
        const duration = 2000;
        const increment = finalValue / (duration / 16);
        
        const counter = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(counter);
            }
            
            const displayValue = Math.floor(currentValue);
            number.textContent = isPercentage ? `${displayValue}%` : displayValue;
        }, 16);
    }
    
    setupNavigationEvents() {
        // Navigation via les markers de progress
        this.progressSteps.forEach((marker, index) => {
            marker.addEventListener('click', () => {
                this.toggleStep(index + 1);
            });
        });
        
        // Navigation clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                const nextStep = Math.min(this.currentStep + 1, this.totalSteps);
                if (nextStep !== this.currentStep) {
                    this.toggleStep(nextStep);
                }
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                const prevStep = Math.max(this.currentStep - 1, 1);
                if (prevStep !== this.currentStep) {
                    this.toggleStep(prevStep);
                }
            }
        });
    }
    
    animateOnLoad() {
        // Animation d'entrée du header
        const header = document.querySelector('.processus-header');
        if (header && typeof gsap !== 'undefined') {
            gsap.fromTo(header, {
                opacity: 0,
                y: 30
            }, {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 0.2,
                ease: \"power2.out\"
            });
        }
        
        // Animation d'entrée de la progress bar
        const progressContainer = document.querySelector('.processus-progress-container');
        if (progressContainer && typeof gsap !== 'undefined') {
            gsap.fromTo(progressContainer, {
                opacity: 0,
                scale: 0.9
            }, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                delay: 0.5,
                ease: \"back.out(1.7)\"
            });
        }
    }
    
    // API publique
    goToStep(stepNumber) {
        if (stepNumber >= 1 && stepNumber <= this.totalSteps) {
            this.toggleStep(stepNumber);
        }
    }
    
    getCurrentStep() {
        return this.currentStep;
    }
    
    destroy() {
        // Nettoyer les event listeners et animations
        this.scrollTriggers.forEach(trigger => {
            if (trigger && trigger.kill) {
                trigger.kill();
            }
        });
        
        console.log('🧹 Timeline Interactive détruite');
    }
}

/**
 * Améliorations UX Premium
 */
class TimelineEnhancements {
    constructor(timeline) {
        this.timeline = timeline;
        this.init();
    }
    
    init() {
        this.addHoverEffects();
        this.addContextualCTAs();
        this.addProgressPreview();
        this.addKeyboardHints();
    }
    
    addHoverEffects() {
        // Effets hover sophistiqués sur les étapes
        const steps = document.querySelectorAll('.processus-step');
        
        steps.forEach(step => {
            const stepNumber = step.querySelector('.step-number');
            const stepIcon = step.querySelector('.step-icon');
            
            step.addEventListener('mouseenter', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(step, {
                        y: -3,
                        duration: 0.3,
                        ease: \"power2.out\"
                    });
                    
                    if (stepNumber) {
                        gsap.to(stepNumber, {
                            scale: 1.05,
                            duration: 0.3,
                            ease: \"power2.out\"
                        });
                    }
                    
                    if (stepIcon) {
                        gsap.to(stepIcon, {
                            scale: 1.1,
                            rotation: 5,
                            duration: 0.3,
                            ease: \"power2.out\"
                        });
                    }
                }
            });
            
            step.addEventListener('mouseleave', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(step, {
                        y: 0,
                        duration: 0.3,
                        ease: \"power2.out\"
                    });
                    
                    if (stepNumber) {
                        gsap.to(stepNumber, {
                            scale: 1,
                            duration: 0.3,
                            ease: \"power2.out\"
                        });
                    }
                    
                    if (stepIcon) {
                        gsap.to(stepIcon, {
                            scale: 1,
                            rotation: 0,
                            duration: 0.3,
                            ease: \"power2.out\"
                        });
                    }
                }
            });
        });
    }
    
    addContextualCTAs() {
        // Animation des CTAs quand ils deviennent visibles
        const ctaButtons = document.querySelectorAll('.cta-step-button, .cta-button');
        
        ctaButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(button, {
                        scale: 1.05,
                        duration: 0.2,
                        ease: \"power2.out\"
                    });
                }
            });
            
            button.addEventListener('mouseleave', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(button, {
                        scale: 1,
                        duration: 0.2,
                        ease: \"power2.out\"
                    });
                }
            });
            
            button.addEventListener('click', (e) => {
                // Animation de clic
                if (typeof gsap !== 'undefined') {
                    gsap.to(button, {
                        scale: 0.95,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1,
                        ease: \"power2.inOut\"
                    });
                }
            });
        });
    }
    
    addProgressPreview() {
        // Preview des étapes au hover des markers
        const progressSteps = document.querySelectorAll('.progress-step');
        
        progressSteps.forEach((marker, index) => {
            marker.addEventListener('mouseenter', () => {
                const preview = this.createStepPreview(index + 1);
                document.body.appendChild(preview);
                
                // Positionner le preview
                const rect = marker.getBoundingClientRect();
                preview.style.left = `${rect.left + rect.width / 2 - 150}px`;
                preview.style.top = `${rect.bottom + 10}px`;
                
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(preview, {
                        opacity: 0,
                        y: -10,
                        scale: 0.9
                    }, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.3,
                        ease: \"power2.out\"
                    });
                }
            });
            
            marker.addEventListener('mouseleave', () => {
                const preview = document.querySelector('.step-preview');
                if (preview) {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(preview, {
                            opacity: 0,
                            y: -10,
                            scale: 0.9,
                            duration: 0.2,
                            onComplete: () => preview.remove()
                        });
                    } else {
                        preview.remove();
                    }
                }
            });
        });
    }
    
    createStepPreview(stepNumber) {
        const steps = [
            { title: \"Audit & Diagnostic\", desc: \"Analyse approfondie de vos processus\" },
            { title: \"Proposition Sur-Mesure\", desc: \"Solution personnalisée avec ROI chiffré\" },
            { title: \"Développement\", desc: \"Implémentation progressive avec tests\" },
            { title: \"Formation & Support\", desc: \"Autonomie complète de votre équipe\" }
        ];
        
        const step = steps[stepNumber - 1];
        const preview = document.createElement('div');
        preview.className = 'step-preview';
        preview.innerHTML = `
            <div style=\"
                background: rgba(10, 10, 26, 0.95);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 16px;
                max-width: 300px;
                color: white;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                position: fixed;
                z-index: 1000;
                pointer-events: none;
            \">
                <h4 style=\"margin: 0 0 8px 0; font-size: 1rem; font-weight: 600;\">${step.title}</h4>
                <p style=\"margin: 0; font-size: 0.85rem; color: rgba(255, 255, 255, 0.7); line-height: 1.4;\">${step.desc}</p>
            </div>
        `;
        
        return preview;
    }
    
    addKeyboardHints() {
        // Afficher des hints pour la navigation clavier
        const hints = document.createElement('div');
        hints.className = 'keyboard-hints';
        hints.innerHTML = `
            <div style=\"
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.04);
                backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 12px 16px;
                font-size: 0.8rem;
                color: rgba(255, 255, 255, 0.7);
                z-index: 999;
                opacity: 0;
                transition: opacity 0.3s ease;
            \">
                ↑↓ Naviguer entre les étapes
            </div>
        `;
        
        document.body.appendChild(hints);
        
        // Afficher temporairement au chargement
        setTimeout(() => {
            hints.firstElementChild.style.opacity = '1';
            setTimeout(() => {
                hints.firstElementChild.style.opacity = '0';
            }, 3000);
        }, 2000);
    }
}

/**
 * Initialisation
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation Timeline Interactive Premium');
    
    // Attendre que GSAP soit chargé si disponible
    const initTimeline = () => {
        window.timelineInteractive = new TimelineInteractive();
        window.timelineEnhancements = new TimelineEnhancements(window.timelineInteractive);
        
        console.log('✅ Timeline Interactive Premium initialisée');
    };
    
    if (typeof gsap !== 'undefined') {
        // GSAP disponible, initialiser avec animations premium
        initTimeline();
    } else {
        // Fallback sans GSAP
        console.warn('⚠️ GSAP non détecté, utilisation du mode fallback');
        initTimeline();
    }
    
    // Cleanup
    window.addEventListener('beforeunload', () => {
        if (window.timelineInteractive) {
            window.timelineInteractive.destroy();
        }
    });
});