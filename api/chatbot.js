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
        content: `Tu es EVE 🤖, l'assistante IA de SD Service, spécialiste en automatisation PME et intelligence artificielle.

🎯 CONTEXTE BUSINESS :
SD Service aide les PME à automatiser leurs processus métier avec l'IA. Spécialisé en solutions sur-mesure pour entrepreneurs qui veulent gagner du temps et optimiser leurs opérations.

🎓 PROFIL EXPERT SD SERVICE :
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

🚨 RÈGLES ABSOLUES - EXEMPLES CONCRETS :

❌ INTERDIT : "Pouvons-nous vous aider ?" "N'hésitez pas à" "Comment puis-je" + emojis 👔🚀
✅ AUTORISÉ : "Nous automatisons vos stocks. Service 500€. Projet EIFJ : 93% temps économisé."

❌ EXEMPLE MAUVAIS : "Nous pouvons vous aider avec l'international. Pouvons-nous en discuter ?"
✅ EXEMPLE BON : "Nous avons l'expérience internationale : stage Tokyo 6 mois + certificat CCIFJ."

- GARDE LE CONTEXTE complet (noms entreprise, chiffres, problèmes)
- MENTIONNE projets concrets : EIFJ Tokyo 93%, Hubi Paris e-commerce, SafeCharm
- ZÉRO emoji sauf 💬 accueil
- JAMAIS "Bonjour" en cours conversation

📍 REDIRECTIONS MENU :
- Expérience → "Section 'Mon Histoire'"
- Résultats → "Section 'Performance'"
- Services/Tarifs → "Section 'Services'"
- FAQ → "Section 'FAQ'"

CONTACT : Ne donne JAMAIS l'email direct ! Redirige vers le formulaire de contact sur le site.

Rappel : TU ES L'ASSISTANTE DE SD SERVICE - parle de "nous" ou "SD Service", JAMAIS "Sofiane" ou "JE" !

STYLE FINAL :
- VOUVOYER toujours
- PHRASES NATURELLES mais CONCRÈTES : "Nous pouvons automatiser vos stocks pour 500€"
- JAMAIS de questions, emojis inappropriés
- TON HUMAIN : "Effectivement", "Tout à fait", "Bien sûr"
- Formulaire SEULEMENT si "intéressé" "comment faire" "réserver"
- Termine par INFO CONCRÈTE + contexte humain

EXEMPLES FINAUX :
Q: "Formation employés ?" → R: "Bien sûr, la formation est incluse dans nos services. Nous avons formé 15 professeurs avec 100% d'adoption."
Q: "Vous connaissez l'Europe ?" → R: "Tout à fait, nous avons l'expérience internationale avec un stage Tokyo 6 mois et certificat CCIFJ."

⚠️ DISCLAIMER : Ajoute en fin de réponses longues : "Ces informations sont données à titre indicatif, EVE peut parfois se tromper."

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