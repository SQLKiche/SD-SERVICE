const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = 3006;

// Configuration CORS
app.use(cors());
app.use(express.json());

// Configuration Google Calendar avec clé API
const calendar = google.calendar({
    version: 'v3',
    auth: process.env.GOOGLE_API_KEY
});

// Route pour obtenir les créneaux disponibles (lecture seule avec clé API)
app.get('/available-slots', async (req, res) => {
    try {
        const { date } = req.query; // Format: YYYY-MM-DD
        if (!date) {
            return res.status(400).json({ error: 'Date requise (format: YYYY-MM-DD)' });
        }

        // Générer les créneaux de 9h à 18h par tranches de 15min
        const slots = generateTimeSlots(date);
        
        // Note: Avec une clé API, on ne peut que lire les calendriers publics
        // Pour un vrai système, il faudrait OAuth ou Service Account
        
        console.log(`📅 Créneaux générés pour ${date}: ${slots.length} créneaux`);
        
        res.json({ 
            availableSlots: slots,
            note: "Créneaux générés - Pour un vrai système, connectez OAuth pour vérifier les conflits"
        });
        
    } catch (error) {
        console.error('❌ Erreur créneaux:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des créneaux' });
    }
});

// Route pour simuler une réservation (pour démo)
app.post('/book-appointment', async (req, res) => {
    try {
        const { datetime, clientName, clientEmail, clientMessage } = req.body;
        
        if (!datetime || !clientName || !clientEmail) {
            return res.status(400).json({ error: 'Données manquantes' });
        }

        // Simulation de création d'événement
        console.log(`📅 SIMULATION - Réservation pour:`);
        console.log(`   👤 Client: ${clientName} (${clientEmail})`);
        console.log(`   📅 Date/Heure: ${datetime}`);
        console.log(`   💬 Message: ${clientMessage || 'Aucun message'}`);
        
        // Dans un vrai système, ici on créerait l'événement via OAuth
        
        res.json({ 
            success: true, 
            eventId: 'demo_' + Date.now(),
            message: `Réservation simulée pour ${clientName} le ${new Date(datetime).toLocaleString('fr-FR')}. Un email de confirmation vous sera envoyé.`,
            note: "DEMO MODE - Pour un vrai système, configurez OAuth pour créer les événements"
        });

    } catch (error) {
        console.error('❌ Erreur réservation:', error);
        res.status(500).json({ error: 'Erreur lors de la réservation' });
    }
});

// Route pour tester la connexion à l'API
app.get('/test-api', async (req, res) => {
    try {
        // Test de connexion basique
        const response = await calendar.calendarList.list();
        res.json({ 
            success: true, 
            message: 'Connexion Google Calendar API réussie !',
            calendars: response.data.items?.length || 0
        });
    } catch (error) {
        console.error('❌ Test API failed:', error);
        res.status(500).json({ 
            error: 'Test API échoué',
            details: error.message,
            note: 'La clé API fonctionne pour les calendriers publics uniquement'
        });
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
                start: start.toISOString(),
                end: end.toISOString(),
                display: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
                available: true // En mode démo, tous les créneaux sont disponibles
            });
        }
    }
    
    return slots;
}

app.listen(PORT, () => {
    console.log(`🚀 Serveur Calendar API (clé API) sur http://localhost:${PORT}`);
    console.log(`📅 Mode DEMO - Créneaux simulés`);
    console.log(`🔧 Test: http://localhost:${PORT}/test-api`);
    console.log(`📋 Créneaux: http://localhost:${PORT}/available-slots?date=2024-12-15`);
});