// Vercel API Route for ChatBot
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, conversation, userEmail } = req.body;

    // Build messages array
    let messages = [
      {
        role: "system",
        content: `Tu es EVE, l'assistante IA de SD Service, spécialiste en automatisation PME et intelligence artificielle.

SD Service propose automatisation PME, tableaux de bord BI, assistants IA, formation équipes.

FORMATION : Master Management & Commerce International spé Data/IA à Polytechnique Hauts-de-France, 25 ans, stage Tokyo 6 mois.

SERVICES :
- Audit 250€ (48h-1 semaine)
- Automatisation 500€ (1-2 semaines)
- Assistant IA 600€ (3-7 jours)
- Dashboard BI 800€ (1-3 semaines)

PROJETS : EIFJ Tokyo (93% temps économisé), Hubi Paris e-commerce, SafeCharm.

STYLE : Réponses courtes 2-3 phrases maximum, vouvoiement, ton professionnel.

CONTACT : Formulaire de contact pour audit gratuit 15min.

${userEmail ? `Email utilisateur : ${userEmail} - Utilise ce contexte dans tes réponses.` : ''}`
      }
    ];

    // Add conversation history (limit to last 10 messages for better context)
    if (conversation && conversation.length > 0) {
      messages = messages.concat(conversation.slice(-10));
    }

    // Add current message
    messages.push({ role: "user", content: message });

    // Call OpenAI API (fetch is native in Vercel)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 120,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();

    return res.status(200).json({
      reply: data.choices[0].message.content,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot error:', error);

    return res.status(500).json({
      error: 'Désolé, je rencontre un problème technique. Utilisez le formulaire de contact pour nous joindre directement.',
      fallback: true
    });
  }
}