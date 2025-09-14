const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3003;

// Configuration CORS
app.use(cors());
app.use(express.json());

// Endpoint proxy pour OpenAI API
app.post('/openai-chat', async (req, res) => {
    try {
        const { apiKey, model, max_tokens, temperature, system, message, conversation, userEmail } = req.body;
        
        console.log(`📨 Requête OpenAI reçue: ${new Date().toISOString()}`);
        if (userEmail) console.log(`📧 Email utilisateur: ${userEmail}`);
        
        const { default: fetch } = await import('node-fetch');
        
        // Construire les messages avec le contexte complet
        let messages = [{ role: "system", content: system }];
        
        // Ajouter l'email utilisateur au contexte si disponible
        if (userEmail) {
            messages[0].content += `\n\nCONTEXTE UTILISATEUR:\nEmail: ${userEmail} - Réutilise cet email dans tes réponses quand pertinent.`;
        }
        
        // Ajouter l'historique de conversation (limité pour éviter des prompts trop longs)
        if (conversation && conversation.length > 0) {
            const recentConversation = conversation.slice(-8); // 8 derniers messages
            messages = messages.concat(recentConversation);
        }
        
        // Ajouter le message actuel
        messages.push({ role: "user", content: message });
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                max_tokens: max_tokens,
                temperature: temperature || 0.7
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.log(`❌ OpenAI API Error: ${response.status}`);
            console.log(JSON.stringify(data, null, 2));
            return res.status(response.status).json({ error: data.error?.message || 'OpenAI API error' });
        }

        const content = data.choices[0].message.content;
        console.log(`✅ Réponse OpenAI: ${content.substring(0, 100)}...`);
        
        res.json({ content });

    } catch (error) {
        console.log(`💥 Proxy Error: ${error.message}`);
        res.status(500).json({ error: `Proxy error: ${error.message}` });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Proxy OpenAI API sur http://localhost:${PORT}`);
    console.log(`✅ CORS activé pour le chatbot`);
});