// Mini-serveur proxy pour contourner CORS avec Claude API
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Configuration CORS
app.use(cors());
app.use(express.json());

// Endpoint proxy pour Claude API
app.post('/api/claude', async (req, res) => {
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
                system: req.body.system,
                messages: req.body.messages
            })
        });

        if (!response.ok) {
            throw new Error(`Claude API error: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ 
            error: 'Proxy server error',
            message: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Proxy Claude API running on http://localhost:${PORT}`);
    console.log(`✅ CORS enabled for chatbot`);
});