/* 🚀 SECTION 3 - PERFORMANCE & IMPACT - STYLE 5: CARDS STACK IMMERSIVE */

/**
 * Cards Stack Immersive avec navigation par onglets
 * Plein écran, sans bordures, effets fluides avancés
 * Animations 3D et transitions spectaculaires
 */
class PerformanceStack {
    constructor() {
        this.currentCard = 'tokyo';
        this.charts = {};
        this.isAnimating = false;
        
        // Configuration des graphiques immersifs
        this.chartsConfig = {
            tokyo: {
                id: 'chartTokyo',
                type: 'bar',
                data: {
                    labels: ['AVANT', 'APRÈS'],
                    datasets: [{
                        label: 'Temps (jours)',
                        data: [14, 1],
                        backgroundColor: [
                            'rgba(255, 107, 107, 0.9)',
                            'rgba(255, 255, 255, 0.9)'
                        ],
                        borderColor: [
                            'rgba(255, 107, 107, 1)',
                            'rgba(255, 255, 255, 1)'
                        ],
                        borderWidth: 3,
                        borderRadius: 15,
                        borderSkipped: false
                    }]
                },
                options: this.getImmersiveChartOptions()
            },
            
            safecharm: {
                id: 'chartSafecharm',
                type: 'doughnut',
                data: {
                    labels: ['Visiteurs', 'Intérêts', 'Achats'],
                    datasets: [{
                        data: [100, 35, 8],
                        backgroundColor: [
                            'rgba(102, 126, 234, 0.9)',
                            'rgba(240, 147, 251, 0.9)',
                            'rgba(255, 255, 255, 0.9)'
                        ],
                        borderColor: [
                            'rgba(102, 126, 234, 1)',
                            'rgba(240, 147, 251, 1)',
                            'rgba(255, 255, 255, 1)'
                        ],
                        borderWidth: 3,
                        cutout: '60%'
                    }]
                },
                options: {
                    ...this.getImmersiveChartOptions(),
                    plugins: {
                        ...this.getImmersiveChartOptions().plugins,
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: 'rgba(255, 255, 255, 0.9)',
                                padding: 25,
                                font: { size: 16, weight: 'bold' },
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        }
                    }
                }
            },
            
            skills: {
                id: 'chartSkills',
                type: 'radar',
                data: {
                    labels: ['Excel', 'Power BI', 'Automatisation', 'Gestion'],
                    datasets: [{
                        label: 'Niveau',
                        data: [90, 75, 80, 85],
                        fill: true,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderColor: 'rgba(255, 255, 255, 1)',
                        borderWidth: 4,
                        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                        pointBorderColor: 'rgba(255, 255, 255, 0.5)',
                        pointRadius: 8,
                        pointBorderWidth: 3,
                        pointHoverRadius: 12
                    }]
                },
                options: {
                    ...this.getImmersiveChartOptions(),
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            grid: { 
                                color: 'rgba(255, 255, 255, 0.3)',
                                lineWidth: 2
                            },
                            angleLines: {
                                color: 'rgba(255, 255, 255, 0.3)',
                                lineWidth: 2
                            },
                            pointLabels: {
                                color: 'rgba(255, 255, 255, 0.9)',
                                font: { size: 16, weight: 'bold' }
                            },
                            ticks: { display: false }
                        }
                    }
                }
            },
            
            current: {
                id: 'chartCurrent',
                type: 'line',
                data: {
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
                    datasets: [{
                        label: 'Projets',
                        data: [1, 2, 3, 3, 3],
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderColor: 'rgba(255, 255, 255, 1)',
                        borderWidth: 4,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                        pointBorderColor: 'rgba(255, 255, 255, 0.5)',
                        pointRadius: 10,
                        pointBorderWidth: 3,
                        pointHoverRadius: 15
                    }]
                },
                options: {
                    ...this.getImmersiveChartOptions(),
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 4,
                            grid: { 
                                color: 'rgba(255, 255, 255, 0.2)',
                                lineWidth: 2
                            },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.8)',
                                stepSize: 1,
                                font: { size: 14, weight: 'bold' }
                            }
                        },
                        x: {
                            grid: { display: false },
                            ticks: {
                                color: 'rgba(255, 255, 255, 0.8)',
                                font: { weight: 'bold', size: 14 }
                            }
                        }
                    }
                }
            }
        };
        
        this.init();
    }
    
    getImmersiveChartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: 'rgba(255, 255, 255, 1)',
                    bodyColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderWidth: 2,
                    cornerRadius: 15,
                    titleFont: { size: 16, weight: 'bold' },
                    bodyFont: { size: 14 },
                    padding: 15
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutCubic',
                animateRotate: true,
                animateScale: true
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            elements: {
                arc: {
                    borderWidth: 3
                },
                bar: {
                    borderSkipped: false
                }
            }
        };
    }
    
    init() {
        console.log('✨ Initialisation Cards Stack Immersive');
        this.setupEventListeners();
        this.initAllCharts();
        this.activateCard('tokyo');
        this.startAnimations();
        console.log('🎊 Cards Stack Immersive initialisé');
    }
    
    setupEventListeners() {
        // Navigation onglets
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const projectId = btn.dataset.project;
                this.switchCard(projectId);
            });
            
            // Effets hover avancés
            btn.addEventListener('mouseenter', () => this.animateTabHover(btn, true));
            btn.addEventListener('mouseleave', () => this.animateTabHover(btn, false));
        });
        
        // Gestion clavier avec animations
        document.addEventListener('keydown', (e) => {
            const projects = ['tokyo', 'safecharm', 'skills', 'current'];
            const currentIndex = projects.indexOf(this.currentCard);
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
                this.switchCard(projects[prevIndex]);
            }
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
                this.switchCard(projects[nextIndex]);
            }
        });
        
        // Interactions avec les orbes
        this.setupOrbInteractions();
    }
    
    setupOrbInteractions() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.stat-orb')) {\n                const orb = e.target.closest('.stat-orb');
                this.animateOrbClick(orb);
            }
        });
    }
    
    animateOrbClick(orb) {
        orb.style.transform = orb.style.transform.replace('scale(1)', 'scale(1.2)');
        orb.style.boxShadow = '0 15px 40px rgba(255, 255, 255, 0.3)';
        
        setTimeout(() => {
            orb.style.transform = orb.style.transform.replace('scale(1.2)', 'scale(1)');
            orb.style.boxShadow = '';
        }, 200);
    }
    
    animateTabHover(tab, isEntering) {
        const icon = tab.querySelector('.tab-icon');
        const glow = tab.querySelector('.tab-glow');
        
        if (isEntering) {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
            glow.style.opacity = '0.2';
            glow.style.transform = 'translate(-50%, -50%) scale(1.1)';
        } else if (!tab.classList.contains('active')) {
            icon.style.transform = 'scale(1) rotate(0deg)';
            glow.style.opacity = '0';
            glow.style.transform = 'translate(-50%, -50%) scale(0)';
        }
    }
    
    initAllCharts() {
        Object.entries(this.chartsConfig).forEach(([cardId, config]) => {
            const canvas = document.getElementById(config.id);
            if (canvas) {
                this.charts[cardId] = new Chart(canvas, {
                    type: config.type,
                    data: config.data,
                    options: config.options
                });
            }
        });
    }
    
    switchCard(cardId) {
        if (cardId === this.currentCard || this.isAnimating) return;
        
        console.log(`🎯 Switch vers card: ${cardId}`);
        this.isAnimating = true;
        
        // Animation de sortie
        this.animateCardExit(() => {
            // Mise à jour navigation
            this.updateTabNavigation(cardId);
            
            // Activation nouvelle card
            this.activateCard(cardId);
            
            // Animation d'entrée
            setTimeout(() => {
                this.animateCardEntrance(() => {
                    this.isAnimating = false;
                });
            }, 100);
        });
        
        this.currentCard = cardId;
    }
    
    activateCard(cardId) {
        // Désactiver toutes les cards
        document.querySelectorAll('.immersive-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Activer la card cible
        const targetCard = document.getElementById(`card${cardId.charAt(0).toUpperCase() + cardId.slice(1)}`);
        if (targetCard) {
            targetCard.classList.add('active');
            
            // Animer le graphique
            setTimeout(() => {
                this.animateChart(cardId);
            }, 800);
        }
    }
    
    animateCardExit(callback) {
        const activeCard = document.querySelector('.immersive-card.active');
        if (activeCard) {
            activeCard.style.transform = 'translateZ(-200px) rotateY(-15deg) scale(0.8)';
            activeCard.style.opacity = '0';
            activeCard.style.filter = 'blur(5px)';
        }
        
        setTimeout(callback, 400);
    }
    
    animateCardEntrance(callback) {
        const activeCard = document.querySelector('.immersive-card.active');
        if (activeCard) {
            activeCard.classList.add('entering');
            
            // Reset des styles
            setTimeout(() => {
                activeCard.style.transform = '';
                activeCard.style.opacity = '';
                activeCard.style.filter = '';
                activeCard.classList.remove('entering');
                callback();
            }, 100);
        } else {
            callback();
        }
    }
    
    updateTabNavigation(activeCardId) {
        document.querySelectorAll('.tab-button').forEach(btn => {
            const isActive = btn.dataset.project === activeCardId;
            btn.classList.toggle('active', isActive);
            
            // Animations des éléments internes
            const icon = btn.querySelector('.tab-icon');
            const glow = btn.querySelector('.tab-glow');
            
            if (isActive) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                glow.style.opacity = '0.4';
                glow.style.transform = 'translate(-50%, -50%) scale(1.3)';
            } else {
                icon.style.transform = 'scale(1) rotate(0deg)';
                glow.style.opacity = '0';
                glow.style.transform = 'translate(-50%, -50%) scale(0)';
            }
        });
    }
    
    animateChart(cardId) {
        if (this.charts[cardId]) {
            // Animation spectaculaire du graphique
            this.charts[cardId].update('active');
            
            // Effet de pulse sur la sphère
            const chartSphere = document.querySelector('.immersive-card.active .chart-sphere');
            if (chartSphere) {
                chartSphere.style.animation = 'none';
                setTimeout(() => {
                    chartSphere.style.animation = '';
                }, 50);
            }
        }
    }
    
    startAnimations() {
        // Animation des vagues du header
        this.animateHeaderWaves();
        
        // Animation des particules d'arrière-plan
        this.animateBackgroundParticles();
        
        // Animation des orbes flottantes
        this.animateFloatingOrbs();
    }
    
    animateHeaderWaves() {
        const waves = document.querySelectorAll('.wave');
        waves.forEach((wave, index) => {
            const duration = 6 + index * 2;
            wave.style.animationDuration = `${duration}s`;
        });
    }
    
    animateBackgroundParticles() {
        const particles = document.querySelectorAll('.bg-particles');
        particles.forEach(particle => {
            particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
        });
    }
    
    animateFloatingOrbs() {
        const orbs = document.querySelectorAll('.stat-orb');
        orbs.forEach((orb, index) => {
            // Animation de flottement
            const floatDuration = 3 + Math.random() * 2;
            const floatDelay = index * 0.5;
            
            orb.style.animation = `orbFloat ${floatDuration}s ease-in-out ${floatDelay}s infinite`;
        });
        
        // Ajouter l'animation CSS si elle n'existe pas
        if (!document.querySelector('#orbFloatAnimation')) {
            const style = document.createElement('style');
            style.id = 'orbFloatAnimation';
            style.textContent = `
                @keyframes orbFloat {
                    0%, 100% { transform: translate(-50%, -50%) translateY(0px) scale(1); }
                    50% { transform: translate(-50%, -50%) translateY(-10px) scale(1.02); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Méthodes d'interaction avancées
    setupAdvancedInteractions() {
        // Parallax sur le mouvement de la souris
        document.addEventListener('mousemove', (e) => {
            this.handleMouseParallax(e);
        });
        
        // Effets de luminosité sur les orbes
        document.addEventListener('mouseenter', (e) => {
            if (e.target.closest('.stat-orb')) {
                this.enhanceOrbGlow(e.target.closest('.stat-orb'));
            }
        });
    }
    
    handleMouseParallax(e) {
        const mouseX = (e.clientX / window.innerWidth) - 0.5;
        const mouseY = (e.clientY / window.innerHeight) - 0.5;
        
        // Appliquer parallax aux éléments flottants
        const orbs = document.querySelectorAll('.stat-orb');
        orbs.forEach((orb, index) => {
            const intensity = (index + 1) * 5;
            orb.style.transform += ` translate(${mouseX * intensity}px, ${mouseY * intensity}px)`;
        });
    }
    
    enhanceOrbGlow(orb) {
        orb.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)';
        orb.style.transform = orb.style.transform.replace('scale(1)', 'scale(1.05)');
        
        setTimeout(() => {
            orb.style.boxShadow = '';
            orb.style.transform = orb.style.transform.replace('scale(1.05)', 'scale(1)');
        }, 300);
    }
    
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
}

/**
 * Initialisation au chargement
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation Section Performance - Style Cards Stack Immersive');
    
    // Attendre le chargement complet pour les animations fluides
    setTimeout(() => {
        window.performanceStack = new PerformanceStack();
        
        // Interactions avancées
        window.performanceStack.setupAdvancedInteractions();
        
    }, 800);
    
    // Cleanup
    window.addEventListener('beforeunload', () => {
        if (window.performanceStack) {
            window.performanceStack.destroy();
        }
    });
    
    console.log('🌟 Style Cards Stack Immersive - Section Performance initialisée');
});