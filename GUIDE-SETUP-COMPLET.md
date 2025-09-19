# 🚀 GUIDE SETUP COMPLET - TRACKING & CONVERSIONS

Guide étape par étape pour configurer votre système de tracking business complet.

---

## 📋 ÉTAPE 1 : GOOGLE ANALYTICS 4

### 1.1 Créer votre compte GA4
1. Allez sur [analytics.google.com](https://analytics.google.com)
2. Créez un compte → "Propriété" → "Application web"
3. **Récupérez votre ID** : `G-XXXXXXXXXX`

### 1.2 Configurer les événements de conversion
Dans GA4, allez dans **Admin** → **Événements** → **Créer un événement** :

**Événements à marquer comme conversions :**
- `contact_form_submission` ✅
- `calendar_booking_completed` ✅
- `chatbot_first_message` ✅
- `phone_call_intent` ✅

---

## 🎥 ÉTAPE 2 : HOTJAR (HEATMAP)

### 2.1 Créer votre compte Hotjar
1. Allez sur [hotjar.com](https://www.hotjar.com)
2. Créez un compte → Ajoutez votre site
3. **Récupérez votre ID** : `1234567`

### 2.2 Configuration recommandée
- **Heatmaps** : Activées sur toutes les pages
- **Recordings** : 100 sessions/mois (plan gratuit)
- **Surveys** : Pop-up de satisfaction optionnel

---

## 📊 ÉTAPE 3 : GOOGLE SHEETS AUTOMATIQUE

### 3.1 Créer vos Google Sheets

#### Sheet 1 : Analytics General
1. [sheets.google.com](https://sheets.google.com) → Nouveau
2. Nommez : **"SD Service - Analytics"**
3. Copiez l'ID du sheet : `1ABC...XYZ`

#### Sheet 2 : Conversions Business
1. Nouveau sheet → Nommez : **"SD Service - Conversions"**
2. Copiez l'ID : `2DEF...UVW`

### 3.2 Créer les Google Apps Scripts

#### Script 1 : Analytics General
1. [script.google.com](https://script.google.com) → Nouveau projet
2. Collez le code de `google-apps-script.js`
3. Remplacez `VOTRE_GOOGLE_SHEET_ID` par l'ID du Sheet Analytics
4. **Déployez** → Web App → **Copiez l'URL**

#### Script 2 : Conversions Business
1. Nouveau projet → Collez `google-apps-script-conversions.js`
2. Remplacez `VOTRE_SHEET_CONVERSIONS_ID` par l'ID du Sheet Conversions
3. **Déployez** → Web App → **Copiez l'URL**

---

## 🔧 ÉTAPE 4 : CONFIGURATION DES FICHIERS

### 4.1 Site Principal (`site-complet.html`)

Remplacez ces valeurs :

```javascript
// Ligne ~1750 : Google Analytics
gtag('config', 'G-VOTRE_ID_GA4'); // Remplacer G-XXXXXXXXXX

// Ligne ~9818 : Conversion tracking
send_to: 'G-VOTRE_ID_GA4', // Remplacer G-XXXXXXXXXX

// Ligne ~9812 : Google Sheets Conversions
const CONVERSION_SHEETS_URL = 'https://script.google.com/macros/s/VOTRE_SCRIPT_CONVERSIONS/exec';
```

### 4.2 Mon Histoire (`sections/0-histoire-complete/index.html`)

Remplacez ces valeurs :

```javascript
// Ligne ~16 : Google Analytics
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VOTRE_ID_GA4"></script>
gtag('config', 'G-VOTRE_ID_GA4');

// Ligne ~28 : Hotjar
h._hjSettings={hjid:VOTRE_ID_HOTJAR,hjsv:6};

// Ligne ~1579 : Google Sheets Analytics
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/VOTRE_SCRIPT_ANALYTICS/exec';
```

### 4.3 Histoire Complete (`histoire-finale-complete.html`)

**Mêmes remplacements** que pour le fichier précédent.

---

## ✅ ÉTAPE 5 : TESTS & VALIDATION

### 5.1 Test Google Analytics
1. Ouvrez votre site
2. GA4 → **Temps réel** → Vérifiez les événements
3. Console navigateur : `console.log(typeof gtag)` → doit retourner `function`

### 5.2 Test Hotjar
1. Naviguez sur votre site 2-3 minutes
2. Hotjar Dashboard → **Recordings** → Vérifiez l'enregistrement
3. **Heatmaps** → Attendez quelques visiteurs

### 5.3 Test Google Sheets
1. Déclenchez une action (formulaire, chatbot, etc.)
2. Vérifiez que les données apparaissent dans les Sheets
3. Console : `Tracking sent` ou `Conversion tracked`

---

## 📈 ÉTAPE 6 : TABLEAUX DE BORD

### 6.1 Dashboard Google Sheets Automatique
Dans Google Apps Script, exécutez :
- `createDashboard()` pour les analytics générales
- `createConversionDashboard()` pour les conversions

### 6.2 Google Analytics Personnalisé
**Rapports recommandés :**
- **Conversions** par source/médium
- **Entonnoir** : Visite → Engagement → Conversion
- **Audiences** : Comportement des visiteurs

### 6.3 Alertes Automatiques
Configurez dans Google Sheets :
- **Notification email** si conversion > 500€
- **Rapport hebdomadaire** automatique
- **Alerte** si 0 conversion en 48h

---

## 🎯 MÉTRIQUES BUSINESS CLÉS

### 📊 Conversions Trackées

| Type | Valeur | Description |
|------|--------|-------------|
| **Formulaire Contact** | 100€ | Lead qualifié |
| **Calendrier Réservé** | 500€ | Prospect chaud |
| **RDV Confirmé** | 1000€ | Conversion finale |
| **Chatbot Ouvert** | 50€ | Engagement initial |
| **Appel Mobile** | 300€ | Contact direct |

### 📱 KPIs à Surveiller

**🎯 Taux de Conversion :**
- Visiteurs → Contact : **2-5%** (objectif)
- Contact → RDV : **30-50%** (objectif)
- RDV → Client : **60-80%** (objectif)

**⏱️ Engagement :**
- Temps moyen : **> 2 minutes**
- Scroll depth : **> 75%**
- Pages/session : **> 2**

---

## 🚨 TROUBLESHOOTING

### ❌ GA4 ne fonctionne pas
- Vérifiez l'ID `G-XXXXXXXXXX`
- Désactivez les bloqueurs de pub
- Testez en navigation privée

### ❌ Hotjar vide
- Vérifiez l'ID Hotjar correct
- Attendez 15 minutes pour les données
- Vérifiez les permissions de site

### ❌ Google Sheets vide
- Testez l'URL du script directement
- Vérifiez les autorisations du script
- Console → Network → Vérifiez les erreurs

### ❌ Conversions non trackées
- Vérifiez les sélecteurs CSS (`form[id*="contact"]`)
- Testez les événements manuellement
- Console → `trackConversion({type: 'test'})`

---

## 🎉 RÉSULTATS ATTENDUS

Avec ce setup, vous obtiendrez :

### 📊 **Analytics Complet**
- **Visiteurs**, **sources**, **comportement**
- **Entonnoir** de conversion détaillé
- **ROI** par canal marketing

### 🎥 **Comportement Visuel**
- **Heatmaps** : Où cliquent les visiteurs
- **Recordings** : Comment ils naviguent
- **Problèmes UX** identifiés automatiquement

### 💼 **Business Intelligence**
- **Prospects** qualifiés automatiquement
- **Alertes** conversions importantes
- **Rapports** hebdomadaires automatiques

---

## 🔄 MAINTENANCE

### Hebdomadaire
- ✅ Vérifier dashboard conversions
- ✅ Analyser sources de trafic performantes
- ✅ Optimiser pages faible conversion

### Mensuel
- ✅ Exporter rapports conversions
- ✅ Analyser tendances Hotjar
- ✅ Ajuster stratégie marketing

**🚀 Votre site est maintenant un véritable outil de génération de leads !**