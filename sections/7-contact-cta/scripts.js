/* 🚀 SECTION 7 - CONTACT CTA - JAVASCRIPT */

/**
 * Contact Section avec formulaire intelligent et validation
 * Gère la soumission, validation et interactions UX
 */
class ContactCTA {
    constructor() {
        this.form = null;
        this.submitBtn = null;
        this.isSubmitting = false;
        this.validationRules = {};
        
        this.init();
    }
    
    init() {
        console.log('🎯 Initialisation Contact CTA');
        this.setupElements();
        this.setupValidationRules();
        this.setupEventListeners();
        this.animateOnLoad();
    }
    
    setupElements() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        
        if (!this.form || !this.submitBtn) {
            console.error('❌ Éléments formulaire non trouvés');
            return;
        }
        
        console.log('✅ Formulaire de contact configuré');
    }
    
    setupValidationRules() {
        this.validationRules = {
            firstName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-ZÀ-ÿ\s-']+$/,
                message: 'Prénom invalide (2 caractères min, lettres uniquement)'
            },
            lastName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-ZÀ-ÿ\s-']+$/,
                message: 'Nom invalide (2 caractères min, lettres uniquement)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email invalide'
            },
            phone: {
                required: false,
                pattern: /^[\+]?[0-9\s\-\(\)]{8,15}$/,
                message: 'Numéro de téléphone invalide'
            },
            company: {
                required: true,
                minLength: 2,
                message: 'Nom d\'entreprise requis (2 caractères min)'
            },
            projectType: {
                required: true,
                message: 'Veuillez sélectionner un type de projet'
            },
            description: {
                required: true,
                minLength: 20,
                maxLength: 1000,
                message: 'Description requise (20-1000 caractères)'
            },
            consent: {
                required: true,
                message: 'Vous devez accepter d\'être contacté'
            }
        };
    }
    
    setupEventListeners() {
        if (!this.form) return;
        
        // Soumission du formulaire
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Validation en temps réel
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
        
        // Interactions spéciales
        this.setupSpecialInteractions();
    }
    
    setupSpecialInteractions() {
        // Auto-suggestion email professionnel
        const emailInput = document.getElementById('email');
        const companyInput = document.getElementById('company');
        
        if (emailInput && companyInput) {
            companyInput.addEventListener('blur', () => {
                const company = companyInput.value.trim();
                if (company && !emailInput.value.includes('@')) {
                    const domain = this.suggestEmailDomain(company);
                    if (domain) {
                        emailInput.placeholder = `ex: prenom.nom@${domain}`;
                    }
                }
            });
        }
        
        // Estimation budget dynamique
        const projectTypeSelect = document.getElementById('projectType');
        const budgetSelect = document.getElementById('budget');
        
        if (projectTypeSelect && budgetSelect) {
            projectTypeSelect.addEventListener('change', () => {
                this.updateBudgetSuggestion(projectTypeSelect.value, budgetSelect);
            });
        }
        
        // Compteur caractères pour description
        const descriptionTextarea = document.getElementById('description');
        if (descriptionTextarea) {
            this.addCharacterCounter(descriptionTextarea);
        }
    }
    
    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;
        
        // Required
        if (rules.required && !value) {
            this.showFieldError(field, rules.message || 'Ce champ est requis');
            return false;
        }
        
        // Skip other validations if field is empty and not required
        if (!value && !rules.required) {
            this.clearFieldError(field);
            return true;
        }
        
        // MinLength
        if (rules.minLength && value.length < rules.minLength) {
            this.showFieldError(field, rules.message);
            return false;
        }
        
        // MaxLength
        if (rules.maxLength && value.length > rules.maxLength) {
            this.showFieldError(field, rules.message);
            return false;
        }
        
        // Pattern
        if (rules.pattern && !rules.pattern.test(value)) {
            this.showFieldError(field, rules.message);
            return false;
        }
        
        // Checkbox validation
        if (field.type === 'checkbox' && rules.required && !field.checked) {
            this.showFieldError(field, rules.message);
            return false;
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        formGroup.classList.add('error');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        formGroup.classList.remove('error');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    validateForm() {
        let isValid = true;
        const formData = new FormData(this.form);
        
        // Valider tous les champs
        for (const [fieldName, rules] of Object.entries(this.validationRules)) {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field && !this.validateField(field)) {
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    async handleSubmit() {
        if (this.isSubmitting) return;
        
        console.log('📤 Tentative de soumission formulaire');
        
        // Validation
        if (!this.validateForm()) {
            console.log('❌ Validation échouée');
            this.showFormError('Veuillez corriger les erreurs dans le formulaire');
            return;
        }
        
        // Démarrer l'état de soumission
        this.setSubmittingState(true);
        
        try {
            // Préparer les données
            const formData = this.collectFormData();
            
            // Simuler l'envoi (remplacer par vraie API)
            const result = await this.submitToAPI(formData);
            
            if (result.success) {
                this.showSuccess();
                this.resetForm();
                this.trackConversion(formData);
            } else {
                this.showFormError(result.message || 'Erreur lors de l\'envoi');
            }
            
        } catch (error) {
            console.error('❌ Erreur soumission:', error);
            this.showFormError('Erreur technique. Veuillez réessayer ou me contacter directement.');
        } finally {
            this.setSubmittingState(false);
        }
    }
    
    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Ajouter métadonnées
        data.timestamp = new Date().toISOString();
        data.userAgent = navigator.userAgent;
        data.referrer = document.referrer;
        data.url = window.location.href;
        
        return data;
    }
    
    async submitToAPI(data) {
        // Simulation d'API - Remplacer par votre endpoint réel
        console.log('📡 Données à envoyer:', data);
        
        // Simulation délai réseau
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulation réponse
        return {
            success: true,
            message: 'Message envoyé avec succès!'
        };
        
        /* EXEMPLE INTEGRATION RÉELLE :
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        return await response.json();
        */
    }
    
    setSubmittingState(isSubmitting) {
        this.isSubmitting = isSubmitting;
        
        const submitText = this.submitBtn.querySelector('.submit-text');
        const submitLoader = this.submitBtn.querySelector('.submit-loader');
        
        if (isSubmitting) {
            this.submitBtn.disabled = true;
            submitText.style.display = 'none';
            submitLoader.style.display = 'inline-block';
            this.submitBtn.textContent = '';
            this.submitBtn.appendChild(submitLoader);
        } else {
            this.submitBtn.disabled = false;
            submitText.style.display = 'inline-block';
            submitLoader.style.display = 'none';
            this.submitBtn.textContent = '';
            this.submitBtn.appendChild(submitText);
        }
    }
    
    showSuccess() {
        let successElement = this.form.querySelector('.form-success');
        
        if (!successElement) {
            successElement = document.createElement('div');
            successElement.className = 'form-success';
            this.form.insertBefore(successElement, this.form.firstChild);
        }
        
        successElement.innerHTML = `
            <h4>✅ Message envoyé avec succès !</h4>
            <p>Je vous recontacte sous 24h. En attendant, vous pouvez aussi me joindre directement par email ou WhatsApp.</p>
        `;
        successElement.classList.add('show');
        
        // Scroll vers le message
        successElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    showFormError(message) {
        // Afficher erreur temporaire
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid #ef4444;
            border-radius: 12px;
            padding: 15px;
            color: #ef4444;
            text-align: center;
            margin-bottom: 20px;
        `;
        errorDiv.textContent = message;
        
        this.form.insertBefore(errorDiv, this.form.firstChild);
        
        // Supprimer après 5 secondes
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    resetForm() {
        this.form.reset();
        
        // Nettoyer les erreurs
        const errorGroups = this.form.querySelectorAll('.form-group.error');
        errorGroups.forEach(group => {
            group.classList.remove('error');
        });
    }
    
    suggestEmailDomain(company) {
        // Suggestions de domaines basées sur le nom d'entreprise
        const commonDomains = {
            'google': 'google.com',
            'microsoft': 'microsoft.com',
            'apple': 'apple.com',
            'amazon': 'amazon.com'
        };
        
        const normalizedCompany = company.toLowerCase().replace(/[^a-z]/g, '');
        
        for (const [key, domain] of Object.entries(commonDomains)) {
            if (normalizedCompany.includes(key)) {
                return domain;
            }
        }
        
        // Domaine générique basé sur le nom
        return `${normalizedCompany.substring(0, 10)}.com`;
    }
    
    updateBudgetSuggestion(projectType, budgetSelect) {
        const suggestions = {
            'audit': '500',
            'automation': '500',
            'powerbi': '1000',
            'ia': '1000',
            'custom': '2000'
        };
        
        const suggested = suggestions[projectType];
        if (suggested && !budgetSelect.value) {
            // Highlight suggestion visually
            budgetSelect.style.borderColor = 'var(--primary-blue)';
            setTimeout(() => {
                budgetSelect.style.borderColor = '';
            }, 2000);
        }
    }
    
    addCharacterCounter(textarea) {
        const counter = document.createElement('div');
        counter.style.cssText = `
            font-size: 0.8rem;
            color: var(--text-muted);
            text-align: right;
            margin-top: 5px;
        `;
        
        const updateCounter = () => {
            const current = textarea.value.length;
            const max = this.validationRules.description.maxLength;
            counter.textContent = `${current}/${max} caractères`;
            
            if (current > max * 0.9) {
                counter.style.color = '#ef4444';
            } else {
                counter.style.color = 'var(--text-muted)';
            }
        };
        
        textarea.addEventListener('input', updateCounter);
        textarea.parentNode.appendChild(counter);
        updateCounter();
    }
    
    trackConversion(data) {
        // Analytics tracking (optionnel)
        console.log('📊 Conversion trackée:', {
            event: 'form_submission',
            projectType: data.projectType,
            budget: data.budget,
            urgency: data.urgency
        });
        
        /* EXEMPLE GOOGLE ANALYTICS :
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submission', {
                'event_category': 'Contact',
                'event_label': data.projectType,
                'value': 1
            });
        }
        */
    }
    
    animateOnLoad() {
        // Animation progressive des éléments
        const elements = [
            document.querySelector('.contact-hero'),
            document.querySelector('.contact-form-section'),
            document.querySelector('.contact-info-section')
        ];
        
        elements.forEach((element, index) => {
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }
}

/**
 * Fonctions d'amélioration UX
 */
function addContactMethodClicks() {
    // Rendre les méthodes de contact cliquables
    const emailMethod = document.querySelector('.contact-method:has(.method-content p)');
    if (emailMethod) {
        emailMethod.style.cursor = 'pointer';
        emailMethod.addEventListener('click', () => {
            const email = emailMethod.querySelector('p').textContent;
            window.location.href = `mailto:${email}`;
        });
    }
}

function addFormSaveRestore() {
    // Sauvegarde automatique du formulaire (localStorage)
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const saveFormData = () => {
        const formData = new FormData(form);
        const data = {};
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        localStorage.setItem('contact_form_draft', JSON.stringify(data));
    };
    
    const restoreFormData = () => {
        const saved = localStorage.getItem('contact_form_draft');
        if (saved) {
            const data = JSON.parse(saved);
            for (const [key, value] of Object.entries(data)) {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && field.type !== 'checkbox') {
                    field.value = value;
                } else if (field && field.type === 'checkbox') {
                    field.checked = value === 'on';
                }
            }
        }
    };
    
    // Restaurer au chargement
    restoreFormData();
    
    // Sauvegarder à chaque modification
    form.addEventListener('input', saveFormData);
    
    // Nettoyer après soumission réussie
    form.addEventListener('submit', () => {
        setTimeout(() => {
            localStorage.removeItem('contact_form_draft');
        }, 1000);
    });
}

/**
 * Initialisation au chargement de la page
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation Section Contact CTA');
    
    // Créer l'instance principale
    window.contactCTA = new ContactCTA();
    
    // Ajouter les améliorations UX
    setTimeout(() => {
        addContactMethodClicks();
        addFormSaveRestore();
    }, 500);
    
    console.log('✅ Contact CTA initialisé avec succès');
});
