/**
 * Agent de Code - Gestion et Review des Fichiers en Temps Réel
 * @author Sofiane Dehaffreingue
 * @version 1.0.0
 */

class CodeAgent {
    constructor(config = {}) {
        this.config = {
            autoSave: true,
            livePreview: true,
            codeAnalysis: true,
            errorTracking: true,
            ...config
        };
        
        this.files = new Map();
        this.watchers = new Map();
        this.errors = [];
        this.changes = [];
        this.isActive = false;
        
        this.init();
    }
    
    /**
     * Initialisation de l'agent
     */
    async init() {
        console.log('🤖 CodeAgent: Initialisation...');
        
        try {
            await this.setupFileWatchers();
            await this.initializeCodeAnalyzer();
            await this.setupUI();
            
            this.isActive = true;
            console.log('✅ CodeAgent: Prêt à l'emploi!');
            
            this.notifyUser('Agent de code activé', 'success');
        } catch (error) {
            console.error('❌ CodeAgent: Erreur d\'initialisation:', error);
            this.notifyUser('Erreur d\'initialisation de l\'agent', 'error');
        }
    }
    
    /**
     * Configuration des watchers de fichiers
     */
    async setupFileWatchers() {
        const filesToWatch = [
            'index.html',
            'styles.css',
            'script.js'
        ];
        
        for (const fileName of filesToWatch) {
            await this.watchFile(fileName);
        }
    }
    
    /**
     * Surveillance d'un fichier
     */
    async watchFile(fileName) {
        try {
            // Simulation de la lecture du fichier
            const fileContent = await this.readFile(fileName);
            this.files.set(fileName, {
                content: fileContent,
                lastModified: new Date(),
                size: fileContent.length,
                errors: [],
                warnings: []
            });
            
            console.log(`👁️ Surveillance active pour: ${fileName}`);
            
            // Simulation d'un watcher
            if (!this.watchers.has(fileName)) {
                const watcherId = setInterval(() => {
                    this.checkForChanges(fileName);
                }, 1000);
                
                this.watchers.set(fileName, watcherId);
            }
        } catch (error) {
            console.error(`❌ Erreur surveillance ${fileName}:`, error);
        }
    }
    
    /**
     * Lecture d'un fichier
     */
    async readFile(fileName) {
        // Simulation de lecture de fichier
        const fileMap = {
            'index.html': document.documentElement.outerHTML,
            'styles.css': Array.from(document.styleSheets)
                .map(sheet => Array.from(sheet.cssRules || [])
                    .map(rule => rule.cssText).join('\n')).join('\n'),
            'script.js': 'console.log("Code JavaScript actuel");'
        };
        
        return fileMap[fileName] || '';
    }
    
    /**
     * Vérification des changements
     */
    async checkForChanges(fileName) {
        try {
            const currentContent = await this.readFile(fileName);
            const fileData = this.files.get(fileName);
            
            if (fileData && currentContent !== fileData.content) {
                console.log(`📝 Changement détecté dans: ${fileName}`);
                
                const change = {
                    fileName,
                    timestamp: new Date(),
                    oldContent: fileData.content,
                    newContent: currentContent,
                    type: this.getChangeType(fileName, fileData.content, currentContent)
                };
                
                this.changes.push(change);
                fileData.content = currentContent;
                fileData.lastModified = new Date();
                
                // Analyse du code modifié
                if (this.config.codeAnalysis) {
                    await this.analyzeCode(fileName, currentContent);
                }
                
                // Notification de changement
                this.notifyUser(`Fichier modifié: ${fileName}`, 'info');
                
                // Auto-sauvegarde si activée
                if (this.config.autoSave) {
                    await this.saveChanges(fileName);
                }
            }
        } catch (error) {
            console.error(`❌ Erreur vérification ${fileName}:`, error);
        }
    }
    
    /**
     * Détermination du type de changement
     */
    getChangeType(fileName, oldContent, newContent) {
        const extension = fileName.split('.').pop();
        
        if (newContent.length > oldContent.length) {
            return 'addition';
        } else if (newContent.length < oldContent.length) {
            return 'deletion';
        } else {
            return 'modification';
        }
    }
    
    /**
     * Analyse du code
     */
    async analyzeCode(fileName, content) {
        const extension = fileName.split('.').pop();
        const fileData = this.files.get(fileName);
        
        // Reset des erreurs précédentes
        fileData.errors = [];
        fileData.warnings = [];
        
        switch (extension) {
            case 'html':
                await this.analyzeHTML(fileName, content);
                break;
            case 'css':
                await this.analyzeCSS(fileName, content);
                break;
            case 'js':
                await this.analyzeJavaScript(fileName, content);
                break;
        }
        
        // Log des résultats d'analyse
        if (fileData.errors.length > 0) {
            console.warn(`⚠️ ${fileData.errors.length} erreurs dans ${fileName}`);
        }
        if (fileData.warnings.length > 0) {
            console.info(`ℹ️ ${fileData.warnings.length} avertissements dans ${fileName}`);
        }
    }
    
    /**
     * Analyse HTML
     */
    async analyzeHTML(fileName, content) {
        const fileData = this.files.get(fileName);
        const parser = new DOMParser();
        
        try {
            const doc = parser.parseFromString(content, 'text/html');
            const parserErrors = doc.querySelectorAll('parsererror');
            
            if (parserErrors.length > 0) {
                parserErrors.forEach(error => {
                    fileData.errors.push({
                        type: 'syntax',
                        message: 'Erreur de syntaxe HTML',
                        line: this.extractLineNumber(error.textContent)
                    });
                });
            }
            
            // Vérifications d'accessibilité
            const images = doc.querySelectorAll('img:not([alt])');
            images.forEach((img, index) => {
                fileData.warnings.push({
                    type: 'accessibility',
                    message: 'Image sans attribut alt',
                    element: `img[${index}]`
                });
            });
            
            // Vérifications SEO
            const title = doc.querySelector('title');
            if (!title || title.textContent.length < 10) {
                fileData.warnings.push({
                    type: 'seo',
                    message: 'Titre de page manquant ou trop court'
                });
            }
            
        } catch (error) {
            fileData.errors.push({
                type: 'parsing',
                message: `Erreur d'analyse HTML: ${error.message}`
            });
        }
    }
    
    /**
     * Analyse CSS
     */
    async analyzeCSS(fileName, content) {
        const fileData = this.files.get(fileName);
        
        // Vérifications basiques
        const lines = content.split('\n');
        lines.forEach((line, index) => {
            // Vérification des accolades
            const openBraces = (line.match(/\{/g) || []).length;
            const closeBraces = (line.match(/\}/g) || []).length;
            
            if (openBraces !== closeBraces && line.trim() !== '') {
                fileData.warnings.push({
                    type: 'syntax',
                    message: 'Accolades non équilibrées',
                    line: index + 1
                });
            }
            
            // Vérification des propriétés dupliquées
            if (line.includes(':')) {
                const property = line.split(':')[0].trim();
                const duplicates = lines.filter(l => 
                    l.includes(property + ':') && l !== line
                );
                
                if (duplicates.length > 0) {
                    fileData.warnings.push({
                        type: 'optimization',
                        message: `Propriété potentiellement dupliquée: ${property}`,
                        line: index + 1
                    });
                }
            }
        });
    }
    
    /**
     * Analyse JavaScript
     */
    async analyzeJavaScript(fileName, content) {
        const fileData = this.files.get(fileName);
        
        try {
            // Vérification basique de la syntaxe
            new Function(content);
            
            // Vérifications de bonnes pratiques
            const lines = content.split('\n');
            lines.forEach((line, index) => {
                // Vérification des console.log en production
                if (line.includes('console.log') && !line.includes('//')) {
                    fileData.warnings.push({
                        type: 'best-practice',
                        message: 'console.log détecté (à retirer en production)',
                        line: index + 1
                    });
                }
                
                // Vérification des variables non déclarées
                if (line.includes('=') && !line.includes('var') && 
                    !line.includes('let') && !line.includes('const')) {
                    const varName = line.split('=')[0].trim();
                    if (varName && !varName.includes('.')) {
                        fileData.warnings.push({
                            type: 'best-practice',
                            message: `Variable potentiellement non déclarée: ${varName}`,
                            line: index + 1
                        });
                    }
                }
            });
            
        } catch (error) {
            fileData.errors.push({
                type: 'syntax',
                message: `Erreur de syntaxe JavaScript: ${error.message}`
            });
        }
    }
    
    /**
     * Extraction du numéro de ligne depuis un message d'erreur
     */
    extractLineNumber(errorText) {
        const match = errorText.match(/line (\d+)/i);
        return match ? parseInt(match[1]) : null;
    }
    
    /**
     * Initialisation de l'analyseur de code
     */
    async initializeCodeAnalyzer() {
        console.log('🔍 Initialisation de l\'analyseur de code...');
        
        // Configuration des règles d'analyse
        this.analysisRules = {
            html: {
                accessibility: true,
                seo: true,
                performance: true
            },
            css: {
                optimization: true,
                compatibility: true,
                validation: true
            },
            js: {
                syntax: true,
                bestPractices: true,
                performance: true
            }
        };
    }
    
    /**
     * Configuration de l'interface utilisateur
     */
    async setupUI() {
        this.createAgentPanel();
        this.createStatusIndicator();
        this.setupKeyboardShortcuts();
    }
    
    /**
     * Création du panneau d'agent
     */
    createAgentPanel() {
        const panel = document.createElement('div');
        panel.id = 'code-agent-panel';
        panel.innerHTML = `
            <div class="agent-header">
                <h3>🤖 Code Agent</h3>
                <button id="agent-toggle">●</button>
            </div>
            <div class="agent-content">
                <div class="agent-status">
                    <span class="status-indicator active"></span>
                    <span>Actif</span>
                </div>
                <div class="agent-stats">
                    <div class="stat">
                        <span class="stat-value">0</span>
                        <span class="stat-label">Fichiers surveillés</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">0</span>
                        <span class="stat-label">Changements</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">0</span>
                        <span class="stat-label">Erreurs</span>
                    </div>
                </div>
                <div class="agent-actions">
                    <button id="analyze-all">Analyser tout</button>
                    <button id="export-report">Rapport</button>
                </div>
                <div class="agent-log" id="agent-log">
                    <div class="log-entry">Agent initialisé ✅</div>
                </div>
            </div>
        `;
        
        // Styles du panneau
        const styles = `
            #code-agent-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 300px;
                background: rgba(15, 15, 35, 0.95);
                border: 1px solid rgba(79, 70, 229, 0.3);
                border-radius: 12px;
                color: white;
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                z-index: 10000;
                backdrop-filter: blur(20px);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
            }
            
            .agent-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid rgba(79, 70, 229, 0.2);
            }
            
            .agent-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }
            
            #agent-toggle {
                background: #4F46E5;
                color: white;
                border: none;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                cursor: pointer;
            }
            
            .agent-content {
                padding: 15px;
            }
            
            .agent-status {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 15px;
            }
            
            .status-indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #10B981;
                animation: pulse 2s infinite;
            }
            
            .agent-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin-bottom: 15px;
            }
            
            .stat {
                text-align: center;
                padding: 8px;
                background: rgba(79, 70, 229, 0.1);
                border-radius: 6px;
            }
            
            .stat-value {
                display: block;
                font-size: 18px;
                font-weight: 600;
                color: #4F46E5;
            }
            
            .stat-label {
                font-size: 11px;
                opacity: 0.7;
            }
            
            .agent-actions {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            }
            
            .agent-actions button {
                flex: 1;
                padding: 8px;
                background: rgba(79, 70, 229, 0.2);
                color: white;
                border: 1px solid rgba(79, 70, 229, 0.3);
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
            }
            
            .agent-actions button:hover {
                background: rgba(79, 70, 229, 0.3);
            }
            
            .agent-log {
                max-height: 150px;
                overflow-y: auto;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 6px;
                padding: 8px;
            }
            
            .log-entry {
                padding: 4px 0;
                font-size: 12px;
                opacity: 0.8;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }
            
            .log-entry:last-child {
                border-bottom: none;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        
        document.body.appendChild(panel);
        
        // Événements
        document.getElementById('agent-toggle').addEventListener('click', () => {
            this.togglePanel();
        });
        
        document.getElementById('analyze-all').addEventListener('click', () => {
            this.analyzeAllFiles();
        });
        
        document.getElementById('export-report').addEventListener('click', () => {
            this.exportReport();
        });
    }
    
    /**
     * Création de l'indicateur de statut
     */
    createStatusIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'agent-status-indicator';
        indicator.innerHTML = '🤖';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #4F46E5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 20px rgba(79, 70, 229, 0.3);
            transition: transform 0.3s ease;
        `;
        
        indicator.addEventListener('mouseenter', () => {
            indicator.style.transform = 'scale(1.1)';
        });
        
        indicator.addEventListener('mouseleave', () => {
            indicator.style.transform = 'scale(1)';
        });
        
        indicator.addEventListener('click', () => {
            this.showQuickStats();
        });
        
        document.body.appendChild(indicator);
    }
    
    /**
     * Configuration des raccourcis clavier
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + Alt + A : Analyser tous les fichiers
            if (e.ctrlKey && e.altKey && e.key === 'a') {
                e.preventDefault();
                this.analyzeAllFiles();
            }
            
            // Ctrl + Alt + R : Générer rapport
            if (e.ctrlKey && e.altKey && e.key === 'r') {
                e.preventDefault();
                this.exportReport();
            }
            
            // Ctrl + Alt + T : Toggle panel
            if (e.ctrlKey && e.altKey && e.key === 't') {
                e.preventDefault();
                this.togglePanel();
            }
        });
    }
    
    /**
     * Basculer le panneau
     */
    togglePanel() {
        const panel = document.getElementById('code-agent-panel');
        const content = panel.querySelector('.agent-content');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            panel.style.height = 'auto';
        } else {
            content.style.display = 'none';
            panel.style.height = '60px';
        }
    }
    
    /**
     * Analyser tous les fichiers
     */
    async analyzeAllFiles() {
        this.addLogEntry('🔍 Analyse complète en cours...');
        
        for (const [fileName, fileData] of this.files) {
            await this.analyzeCode(fileName, fileData.content);
        }
        
        this.updateStats();
        this.addLogEntry('✅ Analyse terminée');
        this.notifyUser('Analyse complète terminée', 'success');
    }
    
    /**
     * Exporter le rapport
     */
    exportReport() {
        const report = this.generateReport();
        const blob = new Blob([report], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `code-review-${new Date().toISOString().split('T')[0]}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.addLogEntry('📄 Rapport exporté');
        this.notifyUser('Rapport exporté avec succès', 'success');
    }
    
    /**
     * Générer le rapport
     */
    generateReport() {
        let report = `# Rapport d'Analyse de Code\n\n`;
        report += `**Date:** ${new Date().toLocaleString()}\n`;
        report += `**Fichiers analysés:** ${this.files.size}\n`;
        report += `**Changements détectés:** ${this.changes.length}\n\n`;
        
        // Résumé des erreurs
        let totalErrors = 0;
        let totalWarnings = 0;
        
        for (const [fileName, fileData] of this.files) {
            totalErrors += fileData.errors.length;
            totalWarnings += fileData.warnings.length;
        }
        
        report += `## Résumé\n\n`;
        report += `- ❌ **Erreurs:** ${totalErrors}\n`;
        report += `- ⚠️ **Avertissements:** ${totalWarnings}\n`;
        report += `- 📊 **Score de qualité:** ${this.calculateQualityScore()}%\n\n`;
        
        // Détail par fichier
        for (const [fileName, fileData] of this.files) {
            report += `## ${fileName}\n\n`;
            report += `- **Taille:** ${fileData.size} caractères\n`;
            report += `- **Dernière modification:** ${fileData.lastModified.toLocaleString()}\n\n`;
            
            if (fileData.errors.length > 0) {
                report += `### Erreurs\n\n`;
                fileData.errors.forEach(error => {
                    report += `- **${error.type}:** ${error.message}`;
                    if (error.line) report += ` (ligne ${error.line})`;
                    report += `\n`;
                });
                report += `\n`;
            }
            
            if (fileData.warnings.length > 0) {
                report += `### Avertissements\n\n`;
                fileData.warnings.forEach(warning => {
                    report += `- **${warning.type}:** ${warning.message}`;
                    if (warning.line) report += ` (ligne ${warning.line})`;
                    report += `\n`;
                });
                report += `\n`;
            }
        }
        
        // Changements récents
        if (this.changes.length > 0) {
            report += `## Changements Récents\n\n`;
            this.changes.slice(-10).forEach(change => {
                report += `- **${change.fileName}** (${change.type}) - ${change.timestamp.toLocaleString()}\n`;
            });
        }
        
        return report;
    }
    
    /**
     * Calculer le score de qualité
     */
    calculateQualityScore() {
        let totalChecks = 0;
        let passedChecks = 0;
        
        for (const [fileName, fileData] of this.files) {
            totalChecks += 10; // Points de base par fichier
            passedChecks += 10 - fileData.errors.length - (fileData.warnings.length * 0.5);
        }
        
        return Math.max(0, Math.round((passedChecks / totalChecks) * 100));
    }
    
    /**
     * Afficher les statistiques rapides
     */
    showQuickStats() {
        const stats = {
            files: this.files.size,
            changes: this.changes.length,
            errors: Array.from(this.files.values()).reduce((acc, file) => acc + file.errors.length, 0),
            warnings: Array.from(this.files.values()).reduce((acc, file) => acc + file.warnings.length, 0)
        };
        
        this.notifyUser(`Fichiers: ${stats.files} | Changements: ${stats.changes} | Erreurs: ${stats.errors}`, 'info');
    }
    
    /**
     * Mettre à jour les statistiques
     */
    updateStats() {
        const panel = document.getElementById('code-agent-panel');
        if (!panel) return;
        
        const statValues = panel.querySelectorAll('.stat-value');
        if (statValues.length >= 3) {
            statValues[0].textContent = this.files.size;
            statValues[1].textContent = this.changes.length;
            statValues[2].textContent = Array.from(this.files.values())
                .reduce((acc, file) => acc + file.errors.length, 0);
        }
    }
    
    /**
     * Ajouter une entrée au log
     */
    addLogEntry(message) {
        const log = document.getElementById('agent-log');
        if (!log) return;
        
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
        
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
        
        // Limiter à 50 entrées
        if (log.children.length > 50) {
            log.removeChild(log.firstChild);
        }
    }
    
    /**
     * Notification utilisateur
     */
    notifyUser(message, type = 'info') {
        console.log(`🤖 CodeAgent: ${message}`);
        this.addLogEntry(message);
        
        // Création d'une notification toast
        const notification = document.createElement('div');
        notification.className = `agent-notification ${type}`;
        notification.textContent = message;
        
        const styles = {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            borderRadius: '8px',
            color: 'white',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            zIndex: '20000',
            opacity: '0',
            transition: 'all 0.3s ease'
        };
        
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6'
        };
        
        Object.assign(notification.style, styles);
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animation d'apparition
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(10px)';
        }, 100);
        
        // Suppression automatique
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-10px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    /**
     * Sauvegarde des changements
     */
    async saveChanges(fileName) {
        console.log(`💾 Sauvegarde automatique: ${fileName}`);
        this.addLogEntry(`💾 ${fileName} sauvegardé`);
    }
    
    /**
     * Arrêt de l'agent
     */
    destroy() {
        // Arrêter tous les watchers
        for (const [fileName, watcherId] of this.watchers) {
            clearInterval(watcherId);
        }
        
        // Supprimer l'interface
        const panel = document.getElementById('code-agent-panel');
        const indicator = document.getElementById('agent-status-indicator');
        
        if (panel) panel.remove();
        if (indicator) indicator.remove();
        
        this.isActive = false;
        console.log('🤖 CodeAgent: Arrêté');
    }
}

// Initialisation automatique de l'agent
let codeAgent;

document.addEventListener('DOMContentLoaded', () => {
    // Démarrage différé pour laisser le temps à la page de se charger
    setTimeout(() => {
        codeAgent = new CodeAgent({
            autoSave: true,
            livePreview: true,
            codeAnalysis: true,
            errorTracking: true
        });
        
        // Exposition globale pour les tests
        window.codeAgent = codeAgent;
    }, 2000);
});

// API publique
window.CodeAgentAPI = {
    start: () => {
        if (!codeAgent) {
            codeAgent = new CodeAgent();
        }
        return codeAgent;
    },
    
    stop: () => {
        if (codeAgent) {
            codeAgent.destroy();
            codeAgent = null;
        }
    },
    
    getStats: () => {
        if (!codeAgent) return null;
        return {
            files: codeAgent.files.size,
            changes: codeAgent.changes.length,
            errors: Array.from(codeAgent.files.values())
                .reduce((acc, file) => acc + file.errors.length, 0),
            isActive: codeAgent.isActive
        };
    },
    
    analyzeAll: () => {
        if (codeAgent) {
            codeAgent.analyzeAllFiles();
        }
    },
    
    exportReport: () => {
        if (codeAgent) {
            codeAgent.exportReport();
        }
    }
};

console.log('🤖 Agent de Code chargé - API disponible via window.CodeAgentAPI');