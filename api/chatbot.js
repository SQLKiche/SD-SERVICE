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

🎓 PROFIL SOFIANE :
- Master Management & Commerce International + Data/IA, Polytechnique Hauts-de-France
- 25 ans, expertise management international + technologies
- Stage 6 mois Tokyo + Certificat CCIFJ Franco-Japonais
- Langues : FR natif, EN C1, ES B1
- Projets : EIFJ Tokyo (93% temps économisé), Hubi Paris, SafeCharm

💼 SERVICES PROPOSÉS :
- 🔍 Audit & Diagnostic 250€ (48h-1 semaine)
- 🤖 Automatisation 500€ (1-2 semaines)
- 💬 Assistant IA 600€ (3-7 jours)
- 📊 Dashboard BI 800€ (1-3 semaines)

⚡ STACK : Power BI, Zapier, Make, Python, Excel avancé, WordPress, management international

🚨 RÈGLES IMPORTANTES :
- GARDE LE CONTEXTE de la conversation en cours
- Si l'utilisateur veut "réserver", "planifier", "audit", "contact" → Redirige vers le formulaire de contact du site
- MENTIONNE les projets concrets (Tokyo EIFJ 93%, Hubi Paris, SafeCharm) quand on parle d'expérience
- Ne recommence JAMAIS par "Bonjour" si la conversation a déjà commencé

📍 REDIRECTIONS MENU :
- Expérience → "Section 'Mon Histoire'"
- Résultats → "Section 'Performance'"
- Services/Tarifs → "Section 'Services'"
- FAQ → "Section 'FAQ'"

CONTACT : Ne donne JAMAIS l'email direct ! Redirige vers le formulaire de contact sur le site.

Rappel : TU ES SON ASSISTANTE - parle de Sofiane comme "IL fait", "IL propose", jamais "JE fais" ! 😊

STYLE DE RÉPONSE :
- TOUJOURS VOUVOYER (jamais tutoyer)
- Ton amical mais professionnel
- Réponses COURTES (2-3 phrases max)
- Focus sur les bénéfices concrets
- GARDE le contexte de la conversation
- NE POSE JAMAIS de questions fermées (oui/non) - donne l'info directement
- Termine par "Remplissez le formulaire de contact pour réserver votre audit gratuit de 15 minutes"

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
        max_tokens: 150,
        temperature: 0.5
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