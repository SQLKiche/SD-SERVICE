# Configuration Google Calendar API

## Étapes pour configurer Google Calendar API

### 1. Créer un projet Google Cloud
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Notez le **Project ID**

### 2. Activer l'API Google Calendar
1. Dans la console Google Cloud, allez dans "APIs & Services" > "Library"
2. Recherchez "Google Calendar API"
3. Cliquez sur "Enable"

### 3. Créer un compte de service
1. Allez dans "APIs & Services" > "Credentials"
2. Cliquez sur "Create Credentials" > "Service Account"
3. Donnez un nom à votre compte de service (ex: "calendar-service")
4. Cliquez sur "Create and Continue"
5. Attribuez le rôle "Editor" (ou "Calendar Editor" si disponible)
6. Cliquez sur "Done"

### 4. Générer une clé privée
1. Cliquez sur le compte de service que vous venez de créer
2. Allez dans l'onglet "Keys"
3. Cliquez sur "Add Key" > "Create New Key"
4. Choisissez le format JSON
5. Téléchargez le fichier JSON

### 5. Partager votre calendrier avec le compte de service
1. Ouvrez Google Calendar
2. Dans la liste de vos calendriers, trouvez celui que vous voulez utiliser
3. Cliquez sur les 3 points à côté du calendrier > "Settings and sharing"
4. Dans "Share with specific people", ajoutez l'email du compte de service (format: nom@projet.iam.gserviceaccount.com)
5. Donnez les permissions "Make changes to events"

### 6. Configurer les variables d'environnement Netlify
1. Allez sur votre dashboard Netlify
2. Sélectionnez votre site
3. Allez dans "Site settings" > "Environment variables"
4. Ajoutez ces variables à partir du fichier JSON téléchargé :

```
GOOGLE_PROJECT_ID = "votre-project-id"
GOOGLE_PRIVATE_KEY_ID = "votre-private-key-id"
GOOGLE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nvotre-private-key\n-----END PRIVATE KEY-----"
GOOGLE_CLIENT_EMAIL = "votre-service-account@votre-projet.iam.gserviceaccount.com"
GOOGLE_CLIENT_ID = "votre-client-id"
GOOGLE_CALENDAR_ID = "primary"
```

### 7. Trouver l'ID de votre calendrier (optionnel)
Si vous voulez utiliser un calendrier spécifique plutôt que le calendrier principal :
1. Dans Google Calendar, allez dans les paramètres du calendrier
2. Scrollez jusqu'à "Calendar ID"
3. Copiez l'ID et utilisez-le comme valeur pour `GOOGLE_CALENDAR_ID`

## Test de la configuration
Une fois configuré, testez avec cet endpoint :
```
POST /.netlify/functions/calendar
{
  "date": "2024-01-15"
}
```

Si tout fonctionne, vous devriez recevoir une liste des créneaux disponibles.

## Sécurité
- Ne commitez JAMAIS le fichier JSON de configuration
- Utilisez uniquement les variables d'environnement sur Netlify
- Le compte de service n'a accès qu'au calendrier partagé