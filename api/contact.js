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

    // Configuration Brevo
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

    // Préparer l'email pour Brevo
    const emailData = {
      sender: {
        name: "SD Service",
        email: "sofiane.dehaffreingue59@gmail.com"
      },
      to: [
        {
          email: "sofiane.dehaffreingue59@gmail.com",
          name: "SD Service"
        }
      ],
      subject: `🔥 Nouvelle demande de ${fullName}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Nouvelle demande de contact</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <p><strong>Nom :</strong> ${fullName}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Secteur :</strong> ${sector || 'Non spécifié'}</p>
            <p><strong>Priorité :</strong> ${priority || 'Non spécifié'}</p>
            <p><strong>Message :</strong><br>${description || 'Aucun message'}</p>
            <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
          </div>
        </div>
      `
    };

    // Envoyer via Brevo
    const brevoResponse = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Api-Key': BREVO_API_KEY
      },
      body: JSON.stringify(emailData)
    });

    if (!brevoResponse.ok) {
      throw new Error(`Brevo API error: ${brevoResponse.status}`);
    }

    const brevoResult = await brevoResponse.json();
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