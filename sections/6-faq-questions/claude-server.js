const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Configuration CORS
app.use(cors());
app.use(express.json());

// Endpoint proxy pour Claude API
app.post('/api/claude', async (req, res) => {
    try {
        console.log('📨 Requête Claude reçue:', new Date().toISOString());
        
        const { default: fetch } = await import('node-fetch');
        
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
                system: req.body.system,
                messages: req.body.messages
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Claude API Error:', response.status, errorText);
            throw new Error(`Claude API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Réponse Claude OK');
        res.json(data);

    } catch (error) {
        console.error('💥 Proxy Error:', error.message);
        res.status(500).json({ 
            error: 'Proxy server error',
            message: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Proxy Claude API sur http://localhost:${PORT}`);
    console.log(`✅ CORS activé pour le chatbot`);
});