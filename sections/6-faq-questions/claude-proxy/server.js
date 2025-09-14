require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Vérification horaires (7h-23h)
const isWorkingHours = () => {
    const hour = new Date().getHours();
    return hour >= 7 && hour < 23;
};

// Route principale pour le proxy Claude
app.post('/api/claude', async (req, res) => {
    // Vérification horaires
    if (!isWorkingHours()) {
        return res.json({
            content: [{
                text: "👋 Je suis disponible de 7h à 23h ! Revenez dans nos horaires d'ouverture ou contactez Sofiane directement par email 😊"
            }]
        });
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': req.body.apiKey,
                'Content-Type': 'application/json',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: req.body.model,
                max_tokens: req.body.max_tokens,
                messages: req.body.messages,
                system: req.body.system
            })
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erreur proxy Claude:', error);
        res.status(500).json({ 
            error: 'Erreur serveur proxy Claude',
            details: error.message 
        });
    }
});

// Route de santé pour Railway
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        workingHours: isWorkingHours(),
        currentHour: new Date().getHours()
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Serveur proxy Claude démarré sur le port ${PORT}`);
    console.log(`Horaires d'ouverture : 7h-23h`);
});
