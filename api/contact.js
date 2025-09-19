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

    // Utiliser les templates Brevo avec les IDs
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

    // Utiliser le template Brevo ID 1 "Formulaire Contact - Notification"
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
      templateId: 1, // Template "Formulaire Contact - Notification"
      params: {
        from_name: fullName,
        from_email: email,
        sector: sector || 'Non spécifié',
        priority: priority || 'Non spécifié',
        message: description || 'Aucun message',
        timestamp: new Date().toLocaleString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    };

    // Envoyer via Brevo avec template
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
    console.log('✅ Email notification envoyé via Brevo:', brevoResult);

    // Envoyer email de confirmation au client (Template 2) - APPEL DIRECT BREVO
    try {
      const clientConfirmationData = {
        sender: {
          name: "SD Service",
          email: "sofiane.dehaffreingue59@gmail.com"
        },
        to: [
          {
            email: email,
            name: fullName
          }
        ],
        templateId: 2, // Template "Confirmation Client - Audit"
        params: {
          to_name: fullName,
          sector: sector || 'Non spécifié',
          priority: priority || 'Non spécifié'
        }
      };

      const clientConfirmationResponse = await fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Api-Key': BREVO_API_KEY
        },
        body: JSON.stringify(clientConfirmationData)
      });

      if (clientConfirmationResponse.ok) {
        const clientResult = await clientConfirmationResponse.json();
        console.log('✅ Email de confirmation client envoyé via Brevo:', clientResult);
      } else {
        console.error('❌ Erreur envoi confirmation client:', clientConfirmationResponse.status);
      }
    } catch (confirmationError) {
      console.error('❌ Erreur envoi confirmation client:', confirmationError);
    }

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