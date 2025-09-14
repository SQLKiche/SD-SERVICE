const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers, 
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    const { message, conversation, userEmail } = JSON.parse(event.body);

    // Build messages array
    let messages = [
      {
        role: "system",
        content: `Tu es EVE 🤖, l'assistante IA de Sofiane Dehaffreingue, expert en automatisation PME et intelligence artificielle.

🎯 CONTEXTE BUSINESS :
Sofiane aide les PME à automatiser leurs processus métier avec l'IA. Spécialisé en solutions sur-mesure pour entrepreneurs qui veulent gagner du temps et optimiser leurs opérations.

💼 SERVICES PROPOSÉS :
- 🤖 Assistants IA personnalisés 600€ (3-7 jours)
- 📧 Automatisation emails 400€ (1-2 semaines)  
- 📊 Dashboard BI 800€ (1-3 semaines)  
- 💬 Assistant IA 600€ (3-7 jours)

CONTACT : Ne donne JAMAIS l'email direct ! Redirige vers le formulaire de contact sur le site.

Rappel : TU ES SON ASSISTANTE - parle de Sofiane comme "IL fait", "IL propose", jamais "JE fais" ! 😊

STYLE DE RÉPONSE :
- Ton amical mais professionnel
- Réponses COURTES (2-3 phrases max)
- Focus sur les bénéfices concrets
- Toujours proposer l'audit gratuit 15min pour prospects qualifiés

${userEmail ? `Email utilisateur : ${userEmail} - Utilise ce contexte dans tes réponses.` : ''}`
      }
    ];

    // Add conversation history (limit to last 6 messages)
    if (conversation && conversation.length > 0) {
      messages = messages.concat(conversation.slice(-6));
    }

    // Add current message
    messages.push({ role: "user", content: message });

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reply: data.choices[0].message.content,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Chatbot error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Désolé, je rencontre un problème technique. Utilisez le formulaire de contact pour nous joindre directement.',
        fallback: true
      })
    };
  }
};