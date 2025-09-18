# 📊 SYSTÈME DE TRACKING AVANCÉ - MON HISTOIRE

Système complet de tracking avec **Google Analytics**, **Hotjar** et **Google Sheets** automatique.

## 🎯 FONCTIONNALITÉS IMPLÉMENTÉES

### ✅ Google Analytics 4
- **Page views** tracking
- **Événements personnalisés** (scroll, clics, images vues)
- **Temps passé** sur la page
- **Engagement** détaillé

### ✅ Hotjar (Heatmap & Session Recording)
- **Heatmaps** des clics et mouvements
- **Enregistrements de sessions** utilisateurs
- **Analyse comportementale** avancée

### ✅ Google Sheets Integration
- **Envoi automatique** de toutes les données
- **Dashboard** en temps réel
- **Métriques détaillées** par visiteur

---

## 🔧 CONFIGURATION REQUISE

### 1. **Google Analytics**
```html
<!-- Remplacer G-XXXXXXXXXX par votre ID GA4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VOTRE_ID_GA4"></script>
```

### 2. **Hotjar**
```javascript
// Remplacer YOUR_HOTJAR_ID par votre ID Hotjar
h._hjSettings={hjid:VOTRE_ID_HOTJAR,hjsv:6};
```

### 3. **Google Sheets + Apps Script**

#### Étape 1 : Créer un Google Sheet
1. Allez sur [sheets.google.com](https://sheets.google.com)
2. Créez un nouveau tableur
3. Nommez-le "Analytics Mon Histoire"
4. Copiez l'ID du Sheet (dans l'URL)

#### Étape 2 : Créer le Google Apps Script
1. Allez sur [script.google.com](https://script.google.com)
2. Nouveau projet → Coller le code de `google-apps-script.js`
3. Remplacer `VOTRE_GOOGLE_SHEET_ID` par l'ID du Sheet
4. Sauvegarder et déployer comme **Web App**
5. Autoriser les permissions

#### Étape 3 : Configurer les fichiers HTML
```javascript
// Remplacer YOUR_SCRIPT_ID par l'ID du script déployé
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/VOTRE_SCRIPT_ID/exec';
```

---

## 📈 MÉTRIQUES TRACKÉES

### 🔍 **Événements Automatiques**
- ✅ **Page Load** - Chargement complet
- ✅ **Scroll Depth** - 25%, 50%, 75%, 100%
- ✅ **Image Views** - Quand les images entrent dans le viewport
- ✅ **Social Clicks** - LinkedIn, Email
- ✅ **CTA Clicks** - Boutons "Retour Site Principal"
- ✅ **Time on Page** - Durée de visite précise

### 📊 **Données Collectées**
- **Timestamp** - Date/heure exacte
- **URL** & **Referrer** - Provenance du visiteur
- **Device Info** - Résolution, viewport, User Agent
- **Session ID** - Suivi de session unique
- **Langue** - Préférence utilisateur

---

## 🎛️ DASHBOARD GOOGLE SHEETS

Le script crée automatiquement :

### 📋 **Feuille "Dashboard"**
- **Total Visiteurs** uniques
- **Pages Vues** totales
- **Temps Moyen** sur la page
- **Clics Sociaux** total
- **Top Événements** par fréquence

### 📋 **Feuille "Données Brutes"**
- **Tous les événements** en détail
- **Filtrable** par type d'événement
- **Exportable** en CSV/Excel

---

## 🚀 MISE EN PRODUCTION

### 1. **Remplacer les IDs**
- `G-XXXXXXXXXX` → Votre ID Google Analytics
- `YOUR_HOTJAR_ID` → Votre ID Hotjar
- `YOUR_SCRIPT_ID` → Votre ID Google Apps Script

### 2. **Tester**
```javascript
// Dans la console du navigateur, vérifier :
console.log('GA4:', typeof gtag !== 'undefined');
console.log('Hotjar:', typeof hj !== 'undefined');
console.log('Sheets:', GOOGLE_APPS_SCRIPT_URL);
```

### 3. **Déployer**
- Commit + Push vers GitHub
- Redéployer sur Vercel
- Vérifier les données dans Google Sheets

---

## 📱 COMPATIBILITÉ

- ✅ **Desktop** & **Mobile**
- ✅ **Tous navigateurs** modernes
- ✅ **GDPR Compliant** (avec consentement)
- ✅ **Performance optimisée** (chargement asynchrone)

---

## 🔧 TROUBLESHOOTING

### ❌ **Google Analytics ne fonctionne pas**
- Vérifier l'ID `G-XXXXXXXXXX`
- Attendre 24h pour voir les données
- Tester en mode Incognito

### ❌ **Hotjar ne charge pas**
- Vérifier l'ID Hotjar
- Désactiver les bloqueurs de pub
- Vérifier la console pour erreurs

### ❌ **Google Sheets vide**
- Vérifier l'URL du script Apps Script
- Vérifier les permissions du script
- Tester l'URL directement dans le navigateur

---

## 🎯 RÉSULTATS ATTENDUS

Avec ce système, vous obtiendrez :

- **📊 Analytics complètes** - Qui visite, d'où, combien de temps
- **🎥 Comportement visuel** - Heatmaps et enregistrements
- **📈 Données exportables** - Google Sheets pour analyses
- **⚡ Temps réel** - Données mises à jour instantanément

**🎉 Votre section "Mon Histoire" est maintenant trackée de A à Z !**