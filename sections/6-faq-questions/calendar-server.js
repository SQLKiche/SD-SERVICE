const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Configuration CORS
app.use(cors());
app.use(express.json());

// Configuration OAuth2
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Calendar API instance
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// Variable pour stocker les tokens (en production, utiliser une base de données)
let tokens = null;

// Route d'authentification
app.get('/auth', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar']
    });
    res.json({ authUrl });
});

// Callback d'authentification
app.get('/auth/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens: newTokens } = await oauth2Client.getToken(code);
        tokens = newTokens;
        oauth2Client.setCredentials(tokens);
        
        console.log('✅ Authentification Google Calendar réussie !');
        res.json({ success: true, message: 'Authentification réussie !' });
    } catch (error) {
        console.error('❌ Erreur authentification:', error);
        res.status(500).json({ error: 'Erreur authentification' });
    }
});

// Route pour obtenir les créneaux disponibles
app.get('/available-slots', async (req, res) => {
    try {
        if (!tokens) {
            return res.status(401).json({ error: 'Non authentifié. Utilisez /auth d\'abord.' });
        }

        oauth2Client.setCredentials(tokens);
        
        const { date } = req.query; // Format: YYYY-MM-DD
        if (!date) {
            return res.status(400).json({ error: 'Date requise (format: YYYY-MM-DD)' });
        }

        // Générer les créneaux de 9h à 18h par tranches de 15min
        const slots = generateTimeSlots(date);
        
        // Vérifier les créneaux occupés
        const busySlots = await getBusySlots(date);
        
        // Filtrer les créneaux disponibles
        const availableSlots = slots.filter(slot => 
            !busySlots.some(busy => 
                slot.start >= busy.start && slot.start < busy.end
            )
        );

        res.json({ availableSlots });
        
    } catch (error) {
        console.error('❌ Erreur créneaux:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des créneaux' });
    }
});

// Route pour réserver un créneau
app.post('/book-appointment', async (req, res) => {
    try {
        if (!tokens) {
            return res.status(401).json({ error: 'Non authentifié' });
        }

        oauth2Client.setCredentials(tokens);
        
        const { datetime, clientName, clientEmail, clientMessage } = req.body;
        
        if (!datetime || !clientName || !clientEmail) {
            return res.status(400).json({ error: 'Données manquantes' });
        }

        // Créer l'événement
        const startTime = new Date(datetime);
        const endTime = new Date(startTime.getTime() + 15 * 60000); // +15 minutes

        const event = {
            summary: `Audit EIFJ - ${clientName}`,
            description: `Audit gratuit de 15 minutes avec ${clientName}\\n\\nEmail: ${clientEmail}\\n\\nMessage: ${clientMessage || 'Aucun message'}`,
            start: {
                dateTime: startTime.toISOString(),
                timeZone: 'Europe/Paris',
            },
            end: {
                dateTime: endTime.toISOString(),
                timeZone: 'Europe/Paris',
            },
            attendees: [
                { email: clientEmail }
            ],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 }, // 24h avant
                    { method: 'popup', minutes: 15 } // 15min avant
                ]
            }
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            sendUpdates: 'all' // Envoie les invitations
        });

        console.log(`✅ RDV créé: ${clientName} - ${startTime}`);
        
        res.json({ 
            success: true, 
            eventId: response.data.id,
            message: 'Rendez-vous confirmé ! Vous recevrez un email de confirmation.' 
        });

    } catch (error) {
        console.error('❌ Erreur réservation:', error);
        res.status(500).json({ error: 'Erreur lors de la réservation' });
    }
});

// Fonction pour générer les créneaux de 15min
function generateTimeSlots(date) {
    const slots = [];
    const startHour = 9;
    const endHour = 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const start = new Date(`${date}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00+02:00`);
            const end = new Date(start.getTime() + 15 * 60000);
            
            slots.push({
                start: start,
                end: end,
                display: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
            });
        }
    }
    
    return slots;
}

// Fonction pour récupérer les créneaux occupés
async function getBusySlots(date) {
    try {
        const startOfDay = new Date(`${date}T00:00:00+02:00`);
        const endOfDay = new Date(`${date}T23:59:59+02:00`);
        
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: startOfDay.toISOString(),
            timeMax: endOfDay.toISOString(),
            singleEvents: true,
            orderBy: 'startTime'
        });

        return response.data.items.map(event => ({
            start: new Date(event.start.dateTime || event.start.date),
            end: new Date(event.end.dateTime || event.end.date)
        }));
        
    } catch (error) {
        console.error('❌ Erreur busy slots:', error);
        return [];
    }
}

app.listen(PORT, () => {
    console.log(`🚀 Serveur Calendar API sur http://localhost:${PORT}`);
    console.log(`📅 Prêt pour les réservations d'audits EIFJ`);
    console.log(`⚠️  Authentifiez-vous d'abord: http://localhost:${PORT}/auth`);
});