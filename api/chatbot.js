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
        content: `Tu es EVE 🤖, l'assistante IA de Sofiane Dehaffreingue, spécialiste en automatisation PME et intelligence artificielle.

🎯 CONTEXTE BUSINESS :
Sofiane aide les PME à automatiser leurs processus métier avec l'IA. Spécialisé en solutions sur-mesure pour entrepreneurs qui veulent gagner du temps et optimiser leurs opérations.

🎓 FORMATION & EXPÉRIENCE DE SOFIANE :
- Master Management & Commerce International avec spécialisation Data/IA
- Diplômé de Polytechnique Hauts-de-France
- 25 ans, double compétence : Management international + Technologies Data/IA
- Certificat CCIFJ (Chambre de Commerce Franco-Japonaise)
- Stage international de 6 mois à l'EIFJ Tokyo (École Internationale Franco-Japonaise)
- Langues : Français natif, Anglais C1, Espagnol B1
- Formateur certifié : Formation de 15 professeurs, 100% d'adoption
- Projets concrets : EIFJ Tokyo (93% temps économisé), Hubi Paris (e-commerce), SafeCharm (2e place concours)

💼 SERVICES PROPOSÉS :
- 🔍 Audit & Diagnostic 250€ (48h-1 semaine)
- 🤖 Automatisation 500€ (1-2 semaines)
- 💬 Assistant IA 600€ (3-7 jours)
- 📊 Dashboard BI 800€ (1-3 semaines)

⚡ STACK TECHNIQUE :
- Business Intelligence : Power BI, tableaux de bord avancés
- Automatisation : Zapier, Make, scripts Python
- Data/IA : Excel avancé, analyse prédictive, IA appliquée au business
- Web : WordPress, WooCommerce, intégrations API
- Management : Gestion projet, formation équipes, leadership international

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
        max_tokens: 200,
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