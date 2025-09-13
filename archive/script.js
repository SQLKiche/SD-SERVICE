// GSAP Scroll Cards Animation
function initGSAPScrollCards() {
    // Enregistrer le plugin ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    const cards = document.querySelectorAll('.card-wrapper');
    
    if (!cards.length) return;
    
    console.log('🎬 GSAP: Initialisation des cartes scroll');
    
    // Animation d'entrée - les cartes arrivent empilées puis se séparent
    gsap.set(cards, {
        y: 0,
        rotationX: 0,
        opacity: 1,
        scale: 1
    });
    
    // Timeline pour l'animation de scroll
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.wrapper',
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
            pin: true,
            pinSpacing: true,
            onUpdate: (self) => {
                console.log(`📊 Scroll progress: ${Math.round(self.progress * 100)}%`);
            }
        }
    });
    
    // Animation de séparation des cartes
    cards.forEach((card, index) => {
        const delay = index * 0.2;
        
        tl.fromTo(card, {
            y: index * 100, // Cartes empilées
            rotationX: 15,
            scale: 0.8,
            opacity: 0.6
        }, {
            y: 0, // Position finale
            rotationX: 0,
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, delay);
    });
    
    // Animation des vidéos
    const videos = document.querySelectorAll('.specialty-video');
    videos.forEach((video, index) => {
        gsap.fromTo(video, {
            scale: 1.2,
            opacity: 0.8
        }, {
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
                trigger: video.closest('.card-wrapper'),
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });
    
    // Gestion des erreurs vidéo
    videos.forEach(video => {
        video.addEventListener('error', function() {
            console.error('❌ Erreur vidéo GSAP:', this.currentSrc || 'source inconnue');
            this.style.display = 'none';
            const fallback = this.parentElement.querySelector('.video-fallback');
            if (fallback) {
                fallback.style.display = 'flex';
                console.log('✅ Fallback emoji affiché');
            }
        });
        
        video.addEventListener('loadeddata', function() {
            console.log('✅ Vidéo GSAP chargée avec succès');
            this.style.display = 'block';
            const fallback = this.parentElement.querySelector('.video-fallback');
            if (fallback) {
                fallback.style.display = 'none';
            }
        });
        
        video.load();
    });
    
    console.log('🚀 GSAP: Cartes scroll initialisées avec succès!');
}

// Animation des graphiques
function initDataAnimations() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger chart animations
                const chartLines = entry.target.querySelectorAll('.chart-line');
                const chartAreas = entry.target.querySelectorAll('.chart-area');
                const dataPoints = entry.target.querySelectorAll('.data-point');
                const bars = entry.target.querySelectorAll('.bar');
                const progressFills = entry.target.querySelectorAll('.progress-fill');
                
                // Reset and trigger animations
                chartLines.forEach(line => {
                    line.style.animation = 'none';
                    line.offsetHeight; // Trigger reflow
                    line.style.animation = 'drawLine 2s ease-out forwards';
                });
                
                chartAreas.forEach(area => {
                    area.style.animation = 'none';
                    area.offsetHeight;
                    area.style.animation = 'fadeInArea 1s ease-out 1s forwards';
                });
                
                dataPoints.forEach((point, index) => {
                    point.style.animation = 'none';
                    point.offsetHeight;
                    point.style.animation = `fadeInPoint 0.5s ease-out ${2 + index * 0.1}s forwards`;
                });
                
                bars.forEach((bar, index) => {
                    bar.style.animation = 'none';
                    bar.offsetHeight;
                    bar.style.animation = `growBar 1s ease-out ${index * 0.2}s forwards`;
                });
                
                progressFills.forEach((fill, index) => {
                    fill.style.animation = 'none';
                    fill.offsetWidth;
                    fill.style.animation = `fillProgress 1.5s ease-out ${index * 0.3}s forwards`;
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const dataSection = document.querySelector('.data-dashboard');
    if (dataSection) {
        observer.observe(dataSection);
    }
}

// Smooth scroll pour les liens de navigation
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight + 40; // +40 for banner
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animation d'apparition des éléments
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.specialty-card, .use-case-card, .pricing-card, .metric-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });
}

// Header scroll effect avec navigation compacte
function initHeaderScroll() {
    const header = document.getElementById('mainHeader');
    const compactNav = document.getElementById('compactNav');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Gestion de la navigation compacte
        if (currentScrollY > 200) {
            // Masquer le header principal
            header.classList.add('scrolled');
            
            // Afficher la navigation compacte
            compactNav.classList.add('visible');
        } else {
            // Afficher le header principal
            header.classList.remove('scrolled');
            
            // Masquer la navigation compacte
            compactNav.classList.remove('visible');
            
            // Rendre le header plus discret en haut
            if (currentScrollY > 50) {
                header.style.background = 'rgba(15, 15, 35, 0.8)';
                header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            } else {
                header.style.background = 'rgba(15, 15, 35, 0.6)';
                header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
            }
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Gestion du clic sur l'icône home pour remonter
    const homeIcon = compactNav.querySelector('.home-item');
    homeIcon.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Gestion des liens de navigation
    const navItems = compactNav.querySelectorAll('.compact-nav-item:not(.home-item)');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href').substring(1);
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

// Parallax effect pour le hero background
function initParallaxEffect() {
    const fluidBg = document.querySelector('.fluid-bg');
    const heroVideo = document.querySelector('.hero-video');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        if (fluidBg) {
            fluidBg.style.transform = `translateY(${rate}px) scale(1.1)`;
        }
        
        // Parallax léger pour la vidéo
        if (heroVideo) {
            const videoRate = scrolled * -0.1;
            heroVideo.style.transform = `translate(-50%, -50%) translateY(${videoRate}px)`;
        }
    });
}

// Animation des boutons avec effet ripple
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn, .get-started-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Gestion du menu mobile (si ajouté plus tard)
function initMobileMenu() {
    // Placeholder pour le menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
}

// Animation des cartes au hover avec effet 3D
function initCardEffects() {
    const cards = document.querySelectorAll('.specialty-card, .use-case-card, .pricing-card, .metric-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) rotateX(5deg)';
            this.style.transformStyle = 'preserve-3d';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0deg)';
        });
        
        // Effet de suivi de la souris
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
    });
}

// Optimisation des performances
function optimizePerformance() {
    // Désactiver les animations si l'utilisateur préfère un mouvement réduit
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-normal', '0s');
        document.documentElement.style.setProperty('--transition-slow', '0s');
        
        // Désactiver l'animation du background fluide
        const fluidBg = document.querySelector('.fluid-bg');
        if (fluidBg) {
            fluidBg.style.animation = 'none';
        }
    }
    
    // Optimiser pour les appareils moins performants
    const isLowEndDevice = navigator.hardwareConcurrency <= 2;
    if (isLowEndDevice) {
        document.body.classList.add('low-performance');
        // Réduire la complexité des animations
        document.documentElement.style.setProperty('--transition-normal', '0.15s ease');
    }
}

// Gestion des erreurs
function handleErrors() {
    window.addEventListener('error', (e) => {
        console.error('Erreur JavaScript:', e.error);
    });
    
    // Gestion des erreurs de chargement des ressources
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Promise rejetée:', e.reason);
    });
}

// Préchargement des ressources critiques
function preloadCriticalResources() {
    // Précharger les polices
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);
}

// Analytics et tracking
function initAnalytics() {
    // Tracking des interactions utilisateur
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-primary') || e.target.classList.contains('get-started-btn')) {
            console.log('CTA clicked:', e.target.textContent);
            // Ici vous pouvez ajouter votre code de tracking (Google Analytics, etc.)
        }
    });
    
    // Tracking du scroll
    let scrollDepth = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (currentScroll > scrollDepth && currentScroll % 25 === 0) {
            scrollDepth = currentScroll;
            console.log('Scroll depth:', scrollDepth + '%');
        }
    });
}

// FONCTION SUPPRIMÉE - On utilise seulement initStackCards()

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Optimisations de performance en premier
    optimizePerformance();
    handleErrors();
    preloadCriticalResources();
    
    // Animations et interactions
    initDataAnimations();
    initGSAPScrollCards();
    initServicesAnimations();
    initSmoothScroll();
    // initServiceStackCards supprimé - On utilise initStackCards
    initScrollAnimations();
    initHeaderScroll();
    initParallaxEffect();
    initButtonEffects();
    initCardEffects();
    initMobileMenu();
    
    // Analytics
    initAnalytics();
    
    // Graphiques interactifs (après un délai pour s'assurer que le DOM est prêt)
    setTimeout(() => {
        initInteractiveCharts();
        initServicesEventHandlers();
        initStackCards();
    }, 1000);
    
    console.log('🚀 Site Sofiane Dehaffreingue initialisé avec succès!');
});

// Gestion du redimensionnement
window.addEventListener('resize', () => {
    // Réajuster les animations si nécessaire
    const cards = document.querySelectorAll('.specialty-card, .use-case-card, .pricing-card');
    cards.forEach(card => {
        card.style.transform = '';
    });
});

// Ajout des styles CSS pour l'effet ripple
const rippleStyles = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.low-performance * {
    animation-duration: 0.1s !important;
    transition-duration: 0.1s !important;
}
`;

// Injecter les styles
const styleSheet = document.createElement('style');
styleSheet.textContent = rippleStyles;
document.head.appendChild(styleSheet);

// Système de graphiques interactifs pour la section Performance & Impact
// Performance Chart Canvas Manager
class PerformanceChart {
    constructor() {
        this.canvas = document.getElementById('productivityChart');
        this.ctx = this.canvas.getContext('2d');
        this.datasets = {
            time: {
                title: "Heures économisées par semaine",
                subtitle: "Évolution du temps libéré après automatisation",
                data: [2, 5, 12, 15, 18, 20],
                labels: ['Mois 1', 'Mois 2', 'Mois 3', 'Mois 4', 'Mois 5', 'Mois 6'],
                color: '#4F46E5',
                max: 25,
                unit: 'h'
            },
            errors: {
                title: "Pourcentage d'erreurs éliminées",
                subtitle: "Progression de l'élimination des erreurs manuelles", 
                data: [10, 25, 45, 65, 80, 95],
                labels: ['Sem 2', 'Sem 4', 'Sem 6', 'Sem 8', 'Sem 10', 'Sem 12'],
                color: '#EC4899',
                max: 100,
                unit: '%'
            },
            roi: {
                title: "Retour sur investissement",
                subtitle: "Évolution du ROI - Période de déploiement",
                data: [0, 50, 150, 220, 280, 312],
                labels: ['Mois 1', 'Mois 3', 'Mois 6', 'Mois 9', 'Mois 12', 'Mois 15'],
                color: '#06B6D4', 
                max: 400,
                unit: '%'
            }
        };
        
        this.currentChart = 'time';
        this.animationFrame = null;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.setupAutoScroll();
        this.drawChart('time');
    }
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }
    
    drawChart(type) {
        const dataset = this.datasets[type];
        if (!dataset) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const padding = { top: 40, right: 40, bottom: 60, left: 60 };
        const chartWidth = this.canvas.clientWidth - padding.left - padding.right;
        const chartHeight = this.canvas.clientHeight - padding.top - padding.bottom;
        
        // Draw grid
        this.drawGrid(padding, chartWidth, chartHeight, dataset);
        
        // Draw line chart
        this.drawLine(padding, chartWidth, chartHeight, dataset);
        
        // Draw points
        this.drawPoints(padding, chartWidth, chartHeight, dataset);
        
        // Update header
        this.updateChartHeader(dataset);
    }
    
    drawGrid(padding, width, height, dataset) {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        // Horizontal lines
        for (let i = 0; i <= 5; i++) {
            const y = padding.top + (height / 5) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(padding.left, y);
            this.ctx.lineTo(padding.left + width, y);
            this.ctx.stroke();
        }
        
        // Vertical lines
        for (let i = 0; i <= dataset.data.length - 1; i++) {
            const x = padding.left + (width / (dataset.data.length - 1)) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(x, padding.top);
            this.ctx.lineTo(x, padding.top + height);
            this.ctx.stroke();
        }
        
        // Y-axis labels
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.font = '12px Inter';
        this.ctx.textAlign = 'right';
        
        for (let i = 0; i <= 5; i++) {
            const value = Math.round((dataset.max / 5) * (5 - i));
            const y = padding.top + (height / 5) * i + 4;
            this.ctx.fillText(value + dataset.unit, padding.left - 10, y);
        }
        
        // X-axis labels
        this.ctx.textAlign = 'center';
        dataset.labels.forEach((label, i) => {
            const x = padding.left + (width / (dataset.data.length - 1)) * i;
            this.ctx.fillText(label, x, padding.top + height + 20);
        });
    }
    
    drawLine(padding, width, height, dataset) {
        this.ctx.strokeStyle = dataset.color;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        dataset.data.forEach((value, i) => {
            const x = padding.left + (width / (dataset.data.length - 1)) * i;
            const y = padding.top + height - (value / dataset.max) * height;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        
        this.ctx.stroke();
    }
    
    drawPoints(padding, width, height, dataset) {
        this.ctx.fillStyle = dataset.color;
        
        dataset.data.forEach((value, i) => {
            const x = padding.left + (width / (dataset.data.length - 1)) * i;
            const y = padding.top + height - (value / dataset.max) * height;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Value labels
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = '11px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(value + dataset.unit, x, y - 10);
            this.ctx.fillStyle = dataset.color;
        });
    }
    
    updateChartHeader(dataset) {
        const header = document.querySelector('.chart-header h3');
        const subtitle = document.querySelector('.chart-header p');
        
        if (header) header.textContent = dataset.title;
        if (subtitle) subtitle.textContent = dataset.subtitle;
    }
    
    setupAutoScroll() {
        let currentIndex = 0;
        const charts = ['time', 'errors', 'roi'];
        
        setInterval(() => {
            if (!this.isAnimating) {
                currentIndex = (currentIndex + 1) % charts.length;
                const nextChart = charts[currentIndex];
                
                if (nextChart !== this.currentChart) {
                    this.switchChart(nextChart);
                }
            }
        }, 8000);
    }
    
    setupEventListeners() {
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach(card => {
            let hoverTimer = null;
            
            // Click to switch chart
            card.addEventListener('click', () => {
                const chartType = card.getAttribute('data-metric');
                if (chartType && chartType !== this.currentChart && !this.isAnimating) {
                    this.switchChart(chartType);
                }
            });
            
            // Hover with 1s delay
            card.addEventListener('mouseenter', () => {
                const chartType = card.getAttribute('data-metric');
                if (chartType && chartType !== this.currentChart && !this.isAnimating) {
                    hoverTimer = setTimeout(() => {
                        if (chartType !== this.currentChart && !this.isAnimating) {
                            this.switchChart(chartType);
                        }
                    }, 1000);
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (hoverTimer) {
                    clearTimeout(hoverTimer);
                    hoverTimer = null;
                }
            });
        });
    }
    
    switchChart(type) {
        if (this.isAnimating || type === this.currentChart) return;
        
        this.isAnimating = true;
        this.currentChart = type;
        
        // Update active card
        document.querySelectorAll('.metric-card').forEach(card => {
            card.classList.remove('active');
            if (card.getAttribute('data-metric') === type) {
                card.classList.add('active');
            }
        });
        
        // Draw new chart
        this.drawChart(type);
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 300);
    }
}

// Initialize Performance Chart
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('productivityChart')) {
        new PerformanceChart();
    }
});

// ===============================
// INTERACTIVE CHARTS CLASS
// ===============================

class InteractiveCharts {
    constructor() {
        this.currentChart = 'time';
        this.isAnimating = false;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.createChart();
    }
    
    setupEventListeners() {
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const chartType = card.dataset.metric;
                if (chartType && chartType !== this.currentChart) {
                    this.switchChart(chartType);
                }
            });
        });
    }
    
    switchChart(chartType) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Mettre à jour l'état actif des cartes
        document.querySelectorAll('.metric-card').forEach(card => {
            card.classList.remove('active');
        });
        document.querySelector(`[data-chart="${chartType}"]`).classList.add('active');
        
        // Animation de transition
        this.fadeOutChart(() => {
            this.updateChart(chartType, true);
            this.fadeInChart(() => {
                this.currentChart = chartType;
                this.isAnimating = false;
            });
        });
    }
    
    previewChart(chartType) {
        // Effet visuel subtil de preview avec GSAP
        const targetCard = document.querySelector(`[data-chart="${chartType}"]`);
        gsap.to(targetCard, {
            y: -8,
            scale: 1.02,
            boxShadow: '0 15px 35px rgba(79, 70, 229, 0.2)',
            duration: 0.3,
            ease: "power2.out"
        });
    }
    
    resetPreview(card) {
        // Reset de l'effet de preview avec GSAP
        gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            duration: 0.3,
            ease: "power2.out"
        });
    }
    
    updateChart(chartType, animate = false) {
        const data = this.datasets[chartType];
        
        // Mettre à jour les titres
        document.querySelector('.chart-title').textContent = data.title;
        document.querySelector('.chart-subtitle').textContent = data.subtitle;
        
        // Mettre à jour les labels X
        const xLabelsContainer = document.getElementById('chart-x-labels');
        xLabelsContainer.innerHTML = data.xLabels.map(label => `<span>${label}</span>`).join('');
        
        // Mettre à jour les labels Y
        const yLabelsContainer = document.querySelector('.y-labels');
        yLabelsContainer.innerHTML = data.yLabels.reverse().map((label, index) => 
            `<text x="70" y="${65 + index * 40}" text-anchor="end">${label}</text>`
        ).join('');
        
        // Calculer les nouvelles positions des points
        const points = this.calculatePoints(data.yValues);
        
        // Mettre à jour la ligne principale
        const pathData = this.generatePathData(points);
        document.querySelector('.main-chart-line').setAttribute('d', pathData);
        
        // Mettre à jour l'aire sous la courbe
        const areaData = pathData + ' L580,220 L80,220 Z';
        document.querySelector('.chart-area-fill').setAttribute('d', areaData);
        
        // Mettre à jour les points de données et leurs labels
        this.updateDataPoints(points, data.yValues);
        
        // Mettre à jour la couleur
        document.querySelector('.main-chart-line').setAttribute('stroke', data.color);
        document.querySelectorAll('.data-point').forEach(point => {
            point.setAttribute('fill', data.color);
        });
        
        if (animate) {
            this.triggerAnimations();
        }
    }
    
    calculatePoints(yValues) {
        const points = [];
        const data = this.datasets[this.currentChart];
        const maxY = data.maxY;
        
        // Positions X selon le nombre de points
        let xPositions;
        if (yValues.length === 6) {
            xPositions = [80, 180, 280, 380, 480, 580];
        } else if (yValues.length === 4) {
            xPositions = [120, 240, 360, 480];
        } else {
            xPositions = [80, 180, 280, 380, 480, 580];
        }
        
        yValues.forEach((value, index) => {
            // Normaliser les valeurs pour s'adapter au graphique (60-220px)
            // Graphique inversé : 220px = 0, 60px = maxY
            const yPos = 220 - (value / maxY) * 160;
            
            points.push({
                x: xPositions[index] || xPositions[xPositions.length - 1],
                y: Math.max(60, Math.min(220, yPos))
            });
        });
        
        return points;
    }
    
    generatePathData(points) {
        return points.map((point, index) => 
            `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`
        ).join(' ');
    }
    
    updateDataPoints(points, values) {
        const dataPointsContainer = document.querySelector('.data-points');
        
        // Supprimer les anciens points
        dataPointsContainer.innerHTML = '';
        
        // Créer les nouveaux points avec labels
        points.forEach((point, index) => {
            // Point de données
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', point.x);
            circle.setAttribute('cy', point.y);
            circle.setAttribute('r', '6');
            circle.setAttribute('fill', this.datasets[this.currentChart].color);
            circle.classList.add('data-point');
            
            // Label du point
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', point.x);
            text.setAttribute('y', point.y - 10);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', 'white');
            text.setAttribute('font-size', '11');
            text.setAttribute('font-weight', '600');
            
            // Formater la valeur selon le type de graphique
            let displayValue = values[index];
            if (this.currentChart === 'time') {
                displayValue = displayValue + 'h';
            } else if (this.currentChart === 'errors' || this.currentChart === 'roi') {
                displayValue = displayValue + '%';
            }
            
            text.textContent = displayValue;
            
            dataPointsContainer.appendChild(circle);
            dataPointsContainer.appendChild(text);
        });
    }
    
    fadeOutChart(callback) {
        const chart = document.querySelector('.productivity-chart');
        gsap.to(chart, {
            opacity: 0,
            scale: 0.95,
            y: -10,
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: callback
        });
    }
    
    fadeInChart(callback) {
        const chart = document.querySelector('.productivity-chart');
        gsap.fromTo(chart, 
            { opacity: 0, scale: 0.95, y: 10 },
            {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
                onComplete: callback
            }
        );
    }
    
    triggerAnimations() {
        // Animations GSAP pour plus de fluidité
        const line = document.querySelector('.main-chart-line');
        const area = document.querySelector('.chart-area-fill');
        const points = document.querySelectorAll('.data-point');
        const texts = document.querySelectorAll('.data-points text');
        
        // Timeline GSAP pour séquencer les animations
        const tl = gsap.timeline();
        
        // Animation de la ligne
        tl.fromTo(line, 
            { strokeDashoffset: 2000 },
            { 
                strokeDashoffset: 0, 
                duration: 1.2, 
                ease: "power2.out" 
            }
        )
        // Animation de l'aire
        .fromTo(area, 
            { opacity: 0 },
            { 
                opacity: 0.3, 
                duration: 0.8, 
                ease: "power2.out" 
            }, 
            "-=0.6"
        )
        // Animation des points
        .fromTo(points, 
            { opacity: 0, scale: 0 },
            { 
                opacity: 1, 
                scale: 1, 
                duration: 0.4, 
                stagger: 0.1,
                ease: "back.out(1.7)" 
            }, 
            "-=0.4"
        )
        // Animation des textes
        .fromTo(texts, 
            { opacity: 0, y: -10 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.3, 
                stagger: 0.1,
                ease: "power2.out" 
            }, 
            "-=0.3"
        );
    }
}

// Initialiser les graphiques interactifs
let interactiveCharts;

// Fonction d'initialisation modifiée
function initInteractiveCharts() {
    interactiveCharts = new InteractiveCharts();
    console.log('📊 Graphiques interactifs initialisés');
}

// ===============================
// SERVICES SECTION ANIMATIONS
// ===============================

function initServicesAnimations() {
    console.log('🎬 Initialisation des animations Services avec Stack Effect');

    // Vérifier que GSAP est disponible
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('⚠️ GSAP non disponible - animations basiques seulement');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Vérification des cartes
    const wrapper = document.querySelector('.wrapper');
    const cards = document.querySelectorAll('.card');
    console.log(`🃏 ${cards.length} cartes trouvées`);
    
    if (!cards.length) {
        console.warn('⚠️ Aucune carte trouvée');
        return;
    }

    // Configuration immédiate - pas d'animation d'attente
    cards.forEach((card, index) => {
        // Position initiale : toutes empilées et visibles immédiatement
        gsap.set(card, {
            zIndex: cards.length - index,
            y: index * 20, // Légèrement décalées
            scale: 1 - index * 0.02,
            opacity: 1, // Toutes visibles dès le début
            visibility: 'visible'
        });
    });

    // Animation Stack au scroll - commence immédiatement
    const stackTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: wrapper,
            start: 'top 90%', // Commence dès qu'on voit la section
            end: 'bottom 10%',
            scrub: 1, // Plus réactif
            onUpdate: (self) => {
                const progress = self.progress;
                
                cards.forEach((card, index) => {
                    // Calcul du progress pour chaque carte (0 à 1)
                    const cardStart = index / cards.length;
                    const cardEnd = (index + 1) / cards.length;
                    const cardProgress = Math.max(0, Math.min(1, (progress - cardStart) / (cardEnd - cardStart)));
                    
                    // Animation de montée progressive
                    gsap.set(card, {
                        y: index * 30 - cardProgress * 50, // Monte moins haut
                        scale: 1 - index * 0.03 + cardProgress * 0.03,
                        opacity: 1,
                        zIndex: cards.length - index + Math.floor(cardProgress * 10)
                    });
                });
            }
        }
    });

    // Hover animations simples
    cards.forEach(card => {        
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    console.log('✅ Animations Services Stack initialisées');
}

// Event Handlers pour la section Services
function initServicesEventHandlers() {
    // Gestion du bouton CTA principal
    const servicesCTA = document.querySelector('.services-cta');
    if (servicesCTA) {
        servicesCTA.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('📞 Demande de contact depuis Services');
            
            // Animation de feedback
            gsap.to(servicesCTA, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: 'power2.out'
            });
            
            // Ici vous pouvez ajouter votre logique de contact
            // Par exemple : ouvrir un modal, rediriger vers un formulaire, etc.
            alert('Merci pour votre intérêt ! Redirection vers le formulaire de contact...');
        });
    }

    // Gestion des clics sur les cartes de services (nouvelle structure)
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const serviceName = card.querySelector('.card-main-title')?.textContent;
            const servicePrice = card.querySelector('.card-price')?.textContent;
            
            console.log(`🎯 Service sélectionné: ${serviceName} - ${servicePrice}`);
            
            // Animation de sélection
            gsap.timeline()
                .to(card, {
                    scale: 0.98,
                    duration: 0.1,
                    ease: 'power2.out'
                })
                .to(card, {
                    scale: 1,
                    duration: 0.1,
                    ease: 'power2.out'
                });
            
            // Ici vous pouvez ajouter votre logique de sélection de service
            // Par exemple : pré-remplir un formulaire avec le service sélectionné
        });
    });
}

// Stack cards avec déclenchement au scroll (COPIE EXACTE du test-simple.html)
function initStackCards() {
    const cards = document.querySelectorAll('.card-wrapper');
    console.log('Cartes trouvées:', cards.length); // Debug
    
    function checkScroll() {
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const servicesSection = document.querySelector('.services');
        if (!servicesSection) return;
        
        const sectionTop = servicesSection.offsetTop;
        
        // Point de départ pour les déclenchements
        const basePoint = sectionTop + (windowHeight * 0.1);
        
        cards.forEach((card, index) => {
            // Intervalle parfaitement uniforme pour toutes les cartes
            const triggerPoint = basePoint + (index * windowHeight * 0.25);
            const resetPoint = triggerPoint - (windowHeight * 0.12); // Point de reset plus haut
            
            if (scrolled >= triggerPoint) {
                card.classList.add('visible');
                console.log('Carte', index + 1, 'visible'); // Debug
            } else if (scrolled < resetPoint && index > 0) {
                // Reset la carte si on remonte (sauf la première)
                card.classList.remove('visible');
            }
        });
    }
    
    // Première carte déjà visible via la classe HTML
    
    window.addEventListener('scroll', checkScroll);
    checkScroll();
}