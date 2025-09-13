/**
 * Live Code Reviewer - Review en temps réel avec suggestions intelligentes
 * @author Sofiane Dehaffreingue
 * @version 1.0.0
 */

class LiveCodeReviewer {
    constructor(codeAgent) {
        this.codeAgent = codeAgent;
        this.isActive = false;
        this.reviewHistory = [];
        this.suggestions = [];
        this.currentReview = null;
        
        // Configuration des règles de review
        this.reviewRules = {
            performance: {
                enabled: true,
                weight: 0.3
            },
            security: {
                enabled: true,
                weight: 0.4
            },
            maintainability: {
                enabled: true,
                weight: 0.2
            },
            accessibility: {
                enabled: true,
                weight: 0.1
            }
        };
        
        this.init();
    }
    
    /**
     * Initialisation du reviewer
     */
    init() {
        console.log('🔍 LiveCodeReviewer: Initialisation...');
        
        this.setupUI();
        this.startReviewProcess();
        this.isActive = true;
        
        console.log('✅ LiveCodeReviewer: Prêt pour la review!');
    }
    
    /**
     * Configuration de l'interface de review
     */
    setupUI() {
        this.createReviewPanel();
        this.createFloatingReviewer();
    }
    
    /**
     * Création du panneau de review
     */
    createReviewPanel() {
        const panel = document.createElement('div');
        panel.id = 'live-review-panel';
        panel.innerHTML = `
            <div class="review-header">
                <h3>🔍 Live Code Review</h3>
                <div class="review-controls">
                    <button id="start-review" class="review-btn">Démarrer</button>
                    <button id="pause-review" class="review-btn">Pause</button>
                    <button id="export-suggestions" class="review-btn">Export</button>
                </div>
            </div>
            <div class="review-content">
                <div class="review-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="review-progress"></div>
                    </div>
                    <span class="progress-text">0% analysé</span>
                </div>
                
                <div class="review-scores">
                    <div class="score-item">
                        <span class="score-label">Performance</span>
                        <span class="score-value" id="performance-score">--</span>
                    </div>
                    <div class="score-item">
                        <span class="score-label">Sécurité</span>
                        <span class="score-value" id="security-score">--</span>
                    </div>
                    <div class="score-item">
                        <span class="score-label">Maintenabilité</span>
                        <span class="score-value" id="maintainability-score">--</span>
                    </div>
                    <div class="score-item">
                        <span class="score-label">Accessibilité</span>
                        <span class="score-value" id="accessibility-score">--</span>
                    </div>
                </div>
                
                <div class="suggestions-container">
                    <h4>🚀 Suggestions d'amélioration</h4>
                    <div id="suggestions-list" class="suggestions-list">
                        <div class="no-suggestions">Aucune suggestion pour le moment</div>
                    </div>
                </div>
                
                <div class="review-log" id="review-log">
                    <h4>📝 Journal de review</h4>
                    <div class="log-entries"></div>
                </div>
            </div>
        `;
        
        // Styles du panneau de review
        const styles = `
            #live-review-panel {
                position: fixed;
                top: 350px;
                right: 20px;
                width: 350px;
                max-height: 600px;
                background: rgba(15, 15, 35, 0.95);
                border: 1px solid rgba(236, 72, 153, 0.3);
                border-radius: 12px;
                color: white;
                font-family: 'Inter', sans-serif;
                font-size: 13px;
                z-index: 9999;
                backdrop-filter: blur(20px);
                box-shadow: 0 20px 60px rgba(236, 72, 153, 0.2);
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            .review-header {
                padding: 15px;
                border-bottom: 1px solid rgba(236, 72, 153, 0.2);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .review-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                color: #EC4899;
            }
            
            .review-controls {
                display: flex;
                gap: 5px;
            }
            
            .review-btn {
                padding: 6px 12px;
                background: rgba(236, 72, 153, 0.2);
                color: white;
                border: 1px solid rgba(236, 72, 153, 0.3);
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.2s ease;
            }
            
            .review-btn:hover {
                background: rgba(236, 72, 153, 0.3);
            }
            
            .review-content {
                padding: 15px;
                max-height: 500px;
                overflow-y: auto;
            }
            
            .review-progress {
                margin-bottom: 20px;
            }
            
            .progress-bar {
                width: 100%;
                height: 6px;
                background: rgba(236, 72, 153, 0.2);
                border-radius: 3px;
                overflow: hidden;
                margin-bottom: 8px;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #EC4899, #F97316);
                width: 0%;
                transition: width 0.3s ease;
            }
            
            .progress-text {
                font-size: 12px;
                opacity: 0.7;
            }
            
            .review-scores {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .score-item {
                display: flex;
                justify-content: space-between;
                padding: 8px;
                background: rgba(236, 72, 153, 0.1);
                border-radius: 6px;
            }
            
            .score-label {
                font-size: 11px;
                opacity: 0.8;
            }
            
            .score-value {
                font-weight: 600;
                color: #EC4899;
            }
            
            .suggestions-container h4,
            .review-log h4 {
                margin: 0 0 10px 0;
                font-size: 14px;
                font-weight: 600;
            }
            
            .suggestions-list {
                max-height: 150px;
                overflow-y: auto;
                margin-bottom: 20px;
            }
            
            .suggestion-item {
                padding: 10px;
                margin-bottom: 8px;
                background: rgba(236, 72, 153, 0.1);
                border-left: 3px solid #EC4899;
                border-radius: 6px;
                font-size: 12px;
            }
            
            .suggestion-priority {
                display: inline-block;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 10px;
                font-weight: 600;
                margin-right: 8px;
            }
            
            .priority-high {
                background: #EF4444;
                color: white;
            }
            
            .priority-medium {
                background: #F59E0B;
                color: white;
            }
            
            .priority-low {
                background: #10B981;
                color: white;
            }
            
            .suggestion-description {
                margin: 5px 0;
                opacity: 0.9;
            }
            
            .suggestion-code {
                background: rgba(0, 0, 0, 0.3);
                padding: 5px;
                border-radius: 3px;
                font-family: monospace;
                font-size: 11px;
                margin: 5px 0;
            }
            
            .no-suggestions {
                text-align: center;
                opacity: 0.5;
                font-style: italic;
                padding: 20px;
            }
            
            .log-entries {
                max-height: 100px;
                overflow-y: auto;
            }
            
            .log-entry {
                padding: 5px 0;
                font-size: 11px;
                opacity: 0.7;
                border-bottom: 1px solid rgba(236, 72, 153, 0.1);
            }
            
            .log-entry:last-child {
                border-bottom: none;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        
        document.body.appendChild(panel);
        
        // Événements
        document.getElementById('start-review').addEventListener('click', () => {
            this.startReview();
        });
        
        document.getElementById('pause-review').addEventListener('click', () => {
            this.pauseReview();
        });
        
        document.getElementById('export-suggestions').addEventListener('click', () => {
            this.exportSuggestions();
        });
    }
    
    /**
     * Création du reviewer flottant
     */
    createFloatingReviewer() {
        const floatingReviewer = document.createElement('div');
        floatingReviewer.id = 'floating-reviewer';
        floatingReviewer.innerHTML = `
            <div class="floating-icon">🔍</div>
            <div class="floating-tooltip">Live Review</div>
        `;
        
        const styles = `
            #floating-reviewer {
                position: fixed;
                top: 50%;
                left: 20px;
                width: 60px;
                height: 60px;
                background: linear-gradient(45deg, #EC4899, #F97316);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 9998;
                box-shadow: 0 4px 20px rgba(236, 72, 153, 0.4);
                transition: all 0.3s ease;
                transform: translateY(-50%);
            }
            
            #floating-reviewer:hover {
                transform: translateY(-50%) scale(1.1);
                box-shadow: 0 6px 30px rgba(236, 72, 153, 0.6);
            }
            
            .floating-icon {
                font-size: 24px;
                animation: pulse-review 2s infinite;
            }
            
            .floating-tooltip {
                position: absolute;
                left: 70px;
                background: rgba(15, 15, 35, 0.95);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-family: 'Inter', sans-serif;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
                border: 1px solid rgba(236, 72, 153, 0.3);
            }
            
            #floating-reviewer:hover .floating-tooltip {
                opacity: 1;
            }
            
            @keyframes pulse-review {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        
        document.body.appendChild(floatingReviewer);
        
        floatingReviewer.addEventListener('click', () => {
            this.toggleReviewPanel();
        });
    }
    
    /**
     * Démarrage du processus de review
     */
    startReviewProcess() {
        // Review automatique toutes les 30 secondes
        this.reviewInterval = setInterval(() => {
            if (this.isActive) {
                this.performAutomaticReview();
            }
        }, 30000);
        
        // Review lors des changements détectés par l'agent
        if (this.codeAgent) {
            this.codeAgent.on?.('fileChanged', (fileName) => {
                this.reviewFile(fileName);
            });
        }
    }
    
    /**
     * Démarrage d'une review manuelle
     */
    startReview() {
        this.addLogEntry('🚀 Début de la review manuelle');
        this.updateProgress(0);
        
        this.performCompleteReview();
    }
    
    /**
     * Pause de la review
     */
    pauseReview() {
        this.isActive = !this.isActive;
        const btn = document.getElementById('pause-review');
        btn.textContent = this.isActive ? 'Pause' : 'Reprendre';
        
        this.addLogEntry(this.isActive ? '▶️ Review reprise' : '⏸️ Review mise en pause');
    }
    
    /**
     * Review automatique
     */
    async performAutomaticReview() {
        if (!this.codeAgent || !this.codeAgent.files) return;
        
        this.addLogEntry('🔄 Review automatique en cours...');
        
        // Analyser les fichiers modifiés récemment
        const recentFiles = Array.from(this.codeAgent.files.entries())
            .filter(([fileName, fileData]) => {
                const timeDiff = Date.now() - fileData.lastModified.getTime();
                return timeDiff < 60000; // Modifiés dans les 60 dernières secondes
            });
        
        if (recentFiles.length > 0) {
            for (const [fileName, fileData] of recentFiles) {
                await this.reviewFile(fileName);
            }
            this.updateScores();
        }
    }
    
    /**
     * Review complète
     */
    async performCompleteReview() {
        if (!this.codeAgent || !this.codeAgent.files) return;
        
        const files = Array.from(this.codeAgent.files.keys());
        const totalFiles = files.length;
        let processedFiles = 0;
        
        this.suggestions = [];
        this.updateSuggestionsList();
        
        for (const fileName of files) {
            await this.reviewFile(fileName);
            processedFiles++;
            this.updateProgress((processedFiles / totalFiles) * 100);
        }
        
        this.updateScores();
        this.addLogEntry('✅ Review complète terminée');
    }
    
    /**
     * Review d'un fichier spécifique
     */
    async reviewFile(fileName) {
        if (!this.codeAgent || !this.codeAgent.files.has(fileName)) return;
        
        const fileData = this.codeAgent.files.get(fileName);
        const extension = fileName.split('.').pop();
        
        this.addLogEntry(`🔍 Analyse de ${fileName}`);
        
        switch (extension) {
            case 'html':
                await this.reviewHTML(fileName, fileData.content);
                break;
            case 'css':
                await this.reviewCSS(fileName, fileData.content);
                break;
            case 'js':
                await this.reviewJavaScript(fileName, fileData.content);
                break;
        }
        
        this.updateSuggestionsList();
    }
    
    /**
     * Review HTML
     */
    async reviewHTML(fileName, content) {
        const suggestions = [];
        
        // Vérifications de performance
        if (content.includes('<script')) {
            const scriptCount = (content.match(/<script/g) || []).length;
            if (scriptCount > 5) {
                suggestions.push({
                    type: 'performance',
                    priority: 'medium',
                    title: 'Trop de scripts',
                    description: `${scriptCount} scripts détectés. Considérez la minification ou la concaténation.`,
                    file: fileName,
                    solution: 'Combinez les scripts en un seul fichier minifié'
                });
            }
        }
        
        // Vérifications SEO
        if (!content.includes('<meta name="description"')) {
            suggestions.push({
                type: 'seo',
                priority: 'high',
                title: 'Meta description manquante',
                description: 'Ajoutez une meta description pour améliorer le SEO.',
                file: fileName,
                solution: '<meta name="description" content="Description de votre page">'
            });
        }
        
        // Vérifications d'accessibilité
        const imgTags = content.match(/<img[^>]+>/g) || [];
        imgTags.forEach(img => {
            if (!img.includes('alt=')) {
                suggestions.push({
                    type: 'accessibility',
                    priority: 'high',
                    title: 'Image sans attribut alt',
                    description: 'Toutes les images doivent avoir un attribut alt.',
                    file: fileName,
                    solution: 'Ajoutez alt="description de l\'image"'
                });
            }
        });
        
        // Vérifications de sécurité
        if (content.includes('javascript:')) {
            suggestions.push({
                type: 'security',
                priority: 'high',
                title: 'JavaScript inline détecté',
                description: 'Évitez javascript: dans les liens pour la sécurité.',
                file: fileName,
                solution: 'Utilisez des événements JavaScript externes'
            });
        }
        
        this.suggestions.push(...suggestions);
    }
    
    /**
     * Review CSS
     */
    async reviewCSS(fileName, content) {
        const suggestions = [];
        const lines = content.split('\n');
        
        // Vérifications de performance
        const importCount = (content.match(/@import/g) || []).length;
        if (importCount > 3) {
            suggestions.push({
                type: 'performance',
                priority: 'medium',
                title: 'Trop d\'imports CSS',
                description: `${importCount} imports détectés. Cela peut ralentir le chargement.`,
                file: fileName,
                solution: 'Combinez les fichiers CSS ou utilisez un bundler'
            });
        }
        
        // Vérifications de maintenabilité
        const duplicateProperties = this.findDuplicateProperties(content);
        if (duplicateProperties.length > 0) {
            suggestions.push({
                type: 'maintainability',
                priority: 'low',
                title: 'Propriétés dupliquées',
                description: `Propriétés potentiellement dupliquées: ${duplicateProperties.join(', ')}`,
                file: fileName,
                solution: 'Utilisez des variables CSS ou des classes utilitaires'
            });
        }
        
        // Vérifications d'accessibilité
        if (!content.includes('focus:') && !content.includes(':focus')) {
            suggestions.push({
                type: 'accessibility',
                priority: 'medium',
                title: 'Styles de focus manquants',
                description: 'Ajoutez des styles de focus pour l\'accessibilité clavier.',
                file: fileName,
                solution: 'Ajoutez des styles :focus pour les éléments interactifs'
            });
        }
        
        this.suggestions.push(...suggestions);
    }
    
    /**
     * Review JavaScript
     */
    async reviewJavaScript(fileName, content) {
        const suggestions = [];
        const lines = content.split('\n');
        
        // Vérifications de performance
        const querySelectors = (content.match(/querySelector/g) || []).length;
        if (querySelectors > 10) {
            suggestions.push({
                type: 'performance',
                priority: 'medium',
                title: 'Trop de sélecteurs DOM',
                description: 'Considérez la mise en cache des références DOM.',
                file: fileName,
                solution: 'Stockez les références DOM dans des variables'
            });
        }
        
        // Vérifications de sécurité
        if (content.includes('innerHTML')) {
            suggestions.push({
                type: 'security',
                priority: 'high',
                title: 'Utilisation d\'innerHTML',
                description: 'innerHTML peut être vulnérable aux attaques XSS.',
                file: fileName,
                solution: 'Utilisez textContent ou des méthodes DOM sécurisées'
            });
        }
        
        if (content.includes('eval(')) {
            suggestions.push({
                type: 'security',
                priority: 'high',
                title: 'Utilisation d\'eval()',
                description: 'eval() est dangereux et peut exécuter du code malveillant.',
                file: fileName,
                solution: 'Évitez eval(), utilisez JSON.parse() ou d\'autres alternatives'
            });
        }
        
        // Vérifications de maintenabilité
        const functionCount = (content.match(/function\s+\w+/g) || []).length;
        const arrowFunctionCount = (content.match(/=>\s*\{/g) || []).length;
        const totalFunctions = functionCount + arrowFunctionCount;
        
        if (totalFunctions > 20) {
            suggestions.push({
                type: 'maintainability',
                priority: 'low',
                title: 'Fichier complexe',
                description: `${totalFunctions} fonctions détectées. Considérez la modularisation.`,
                file: fileName,
                solution: 'Divisez le code en modules plus petits'
            });
        }
        
        // Vérifications des console.log
        const consoleCount = (content.match(/console\.log/g) || []).length;
        if (consoleCount > 0) {
            suggestions.push({
                type: 'maintainability',
                priority: 'low',
                title: 'Console.log en production',
                description: `${consoleCount} console.log détectés.`,
                file: fileName,
                solution: 'Retirez les console.log avant la mise en production'
            });
        }
        
        this.suggestions.push(...suggestions);
    }
    
    /**
     * Recherche de propriétés CSS dupliquées
     */
    findDuplicateProperties(cssContent) {
        const properties = [];
        const matches = cssContent.match(/[\w-]+\s*:/g) || [];
        
        matches.forEach(match => {
            const prop = match.replace(':', '').trim();
            properties.push(prop);
        });
        
        const duplicates = properties.filter((prop, index) => 
            properties.indexOf(prop) !== index
        );
        
        return [...new Set(duplicates)];
    }
    
    /**
     * Mise à jour de la liste des suggestions
     */
    updateSuggestionsList() {
        const container = document.getElementById('suggestions-list');
        if (!container) return;
        
        if (this.suggestions.length === 0) {
            container.innerHTML = '<div class="no-suggestions">Aucune suggestion pour le moment</div>';
            return;
        }
        
        // Trier par priorité
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        this.suggestions.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
        
        container.innerHTML = this.suggestions.map(suggestion => `
            <div class="suggestion-item">
                <div>
                    <span class="suggestion-priority priority-${suggestion.priority}">
                        ${suggestion.priority.toUpperCase()}
                    </span>
                    <strong>${suggestion.title}</strong>
                </div>
                <div class="suggestion-description">${suggestion.description}</div>
                <div class="suggestion-code">${suggestion.solution}</div>
                <div style="font-size: 10px; opacity: 0.6; margin-top: 5px;">
                    📁 ${suggestion.file} | 🏷️ ${suggestion.type}
                </div>
            </div>
        `).join('');
    }
    
    /**
     * Mise à jour des scores
     */
    updateScores() {
        const scores = this.calculateScores();
        
        document.getElementById('performance-score').textContent = scores.performance + '%';
        document.getElementById('security-score').textContent = scores.security + '%';
        document.getElementById('maintainability-score').textContent = scores.maintainability + '%';
        document.getElementById('accessibility-score').textContent = scores.accessibility + '%';
    }
    
    /**
     * Calcul des scores
     */
    calculateScores() {
        const totalSuggestions = this.suggestions.length;
        if (totalSuggestions === 0) {
            return {
                performance: 100,
                security: 100,
                maintainability: 100,
                accessibility: 100
            };
        }
        
        const suggestionsByType = {
            performance: this.suggestions.filter(s => s.type === 'performance'),
            security: this.suggestions.filter(s => s.type === 'security'),
            maintainability: this.suggestions.filter(s => s.type === 'maintainability'),
            accessibility: this.suggestions.filter(s => s.type === 'accessibility')
        };
        
        const scores = {};
        Object.keys(suggestionsByType).forEach(type => {
            const suggestions = suggestionsByType[type];
            const highPriority = suggestions.filter(s => s.priority === 'high').length * 3;
            const mediumPriority = suggestions.filter(s => s.priority === 'medium').length * 2;
            const lowPriority = suggestions.filter(s => s.priority === 'low').length * 1;
            
            const penalty = highPriority + mediumPriority + lowPriority;
            scores[type] = Math.max(0, 100 - penalty * 5);
        });
        
        return scores;
    }
    
    /**
     * Mise à jour de la barre de progression
     */
    updateProgress(percentage) {
        const progressFill = document.getElementById('review-progress');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }
        
        if (progressText) {
            progressText.textContent = Math.round(percentage) + '% analysé';
        }
    }
    
    /**
     * Ajout d'une entrée au log
     */
    addLogEntry(message) {
        const logContainer = document.querySelector('#review-log .log-entries');
        if (!logContainer) return;
        
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
        
        logContainer.appendChild(entry);
        logContainer.scrollTop = logContainer.scrollHeight;
        
        // Limiter à 20 entrées
        if (logContainer.children.length > 20) {
            logContainer.removeChild(logContainer.firstChild);
        }
    }
    
    /**
     * Basculer le panneau de review
     */
    toggleReviewPanel() {
        const panel = document.getElementById('live-review-panel');
        if (!panel) return;
        
        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            setTimeout(() => panel.style.opacity = '1', 10);
        } else {
            panel.style.opacity = '0';
            setTimeout(() => panel.style.display = 'none', 300);
        }
    }
    
    /**
     * Export des suggestions
     */
    exportSuggestions() {
        if (this.suggestions.length === 0) {
            this.addLogEntry('⚠️ Aucune suggestion à exporter');
            return;
        }
        
        const report = this.generateSuggestionsReport();
        const blob = new Blob([report], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `code-review-suggestions-${new Date().toISOString().split('T')[0]}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.addLogEntry('📄 Suggestions exportées');
    }
    
    /**
     * Génération du rapport de suggestions
     */
    generateSuggestionsReport() {
        let report = `# Rapport de Review - Suggestions d'Amélioration\n\n`;
        report += `**Date:** ${new Date().toLocaleString()}\n`;
        report += `**Nombre de suggestions:** ${this.suggestions.length}\n\n`;
        
        const scores = this.calculateScores();
        report += `## Scores de Qualité\n\n`;
        report += `- 🚀 **Performance:** ${scores.performance}%\n`;
        report += `- 🔒 **Sécurité:** ${scores.security}%\n`;
        report += `- 🔧 **Maintenabilité:** ${scores.maintainability}%\n`;
        report += `- ♿ **Accessibilité:** ${scores.accessibility}%\n\n`;
        
        // Grouper par type
        const groupedSuggestions = {};
        this.suggestions.forEach(suggestion => {
            if (!groupedSuggestions[suggestion.type]) {
                groupedSuggestions[suggestion.type] = [];
            }
            groupedSuggestions[suggestion.type].push(suggestion);
        });
        
        Object.keys(groupedSuggestions).forEach(type => {
            const typeEmojis = {
                performance: '🚀',
                security: '🔒',
                maintainability: '🔧',
                accessibility: '♿'
            };
            
            report += `## ${typeEmojis[type]} ${type.charAt(0).toUpperCase() + type.slice(1)}\n\n`;
            
            groupedSuggestions[type].forEach((suggestion, index) => {
                const priorityEmoji = {
                    high: '🔴',
                    medium: '🟡',
                    low: '🟢'
                };
                
                report += `### ${index + 1}. ${suggestion.title} ${priorityEmoji[suggestion.priority]}\n\n`;
                report += `**Fichier:** ${suggestion.file}\n`;
                report += `**Priorité:** ${suggestion.priority}\n`;
                report += `**Description:** ${suggestion.description}\n\n`;
                report += `**Solution suggérée:**\n`;
                report += `\`\`\`\n${suggestion.solution}\n\`\`\`\n\n`;
            });
        });
        
        return report;
    }
    
    /**
     * Arrêt du reviewer
     */
    destroy() {
        if (this.reviewInterval) {
            clearInterval(this.reviewInterval);
        }
        
        const panel = document.getElementById('live-review-panel');
        const floatingReviewer = document.getElementById('floating-reviewer');
        
        if (panel) panel.remove();
        if (floatingReviewer) floatingReviewer.remove();
        
        this.isActive = false;
        console.log('🔍 LiveCodeReviewer: Arrêté');
    }
}

// Export pour utilisation
window.LiveCodeReviewer = LiveCodeReviewer;

console.log('🔍 Live Code Reviewer chargé - Prêt pour la review en temps réel!');