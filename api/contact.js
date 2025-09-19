// API Vercel pour formulaire de contact avec Brevo
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
    const { fullName, email, sector, priority, description } = req.body;

    // Basic validation
    if (!fullName || !email) {
      return res.status(400).json({
        error: 'Nom et email requis'
      });
    }

    // Utiliser l'API send-email avec templates Brevo
    const emailResponse = await fetch(`${req.headers.origin}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        templateType: 'contact-form',
        data: {
          fullName: fullName,
          email: email,
          sector: sector || 'Non spécifié',
          priority: priority || 'Non spécifié',
          description: description || 'Aucun message'
        }
      })
    });

    if (!emailResponse.ok) {
      throw new Error(`Send-email API error: ${emailResponse.status}`);
    }

    const brevoResult = await emailResponse.json();
    console.log('✅ Email envoyé via Brevo:', brevoResult);

    // Réponse de succès
    return res.status(200).json({
      success: true,
      message: 'Votre demande a été envoyée avec succès. Nous vous contactons sous 24h !',
      timestamp: new Date().toISOString(),
      brevoMessageId: brevoResult.messageId
    });

  } catch (error) {
    console.error('❌ Erreur contact form:', error);

    return res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter directement.',
      fallback: true
    });
  }
}