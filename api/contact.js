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

    // Configuration Brevo avec template amélioré
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

    // Template HTML premium pour les emails
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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            .email-container { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; }
            .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 40px 30px; text-align: center; }
            .header h1 { color: #ffffff; font-size: 28px; margin: 0; font-weight: 700; }
            .header p { color: #E5E7EB; font-size: 16px; margin: 10px 0 0 0; }
            .content { padding: 40px 30px; }
            .info-card { background: #F8FAFC; border-left: 4px solid #4F46E5; padding: 25px; margin: 20px 0; border-radius: 8px; }
            .info-row { display: flex; margin: 15px 0; }
            .info-label { font-weight: 600; color: #374151; min-width: 120px; }
            .info-value { color: #1F2937; }
            .message-box { background: #EFF6FF; border: 1px solid #DBEAFE; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { background: #F9FAFB; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB; }
            .footer p { color: #6B7280; font-size: 14px; margin: 5px 0; }
            .priority-high { color: #DC2626; font-weight: 600; }
            .priority-medium { color: #D97706; font-weight: 600; }
            .timestamp { color: #6B7280; font-size: 12px; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>🚀 Nouvelle Demande Contact</h1>
              <p>Un prospect qualifié souhaite être contacté</p>
            </div>

            <div class="content">
              <div class="info-card">
                <div class="info-row">
                  <div class="info-label">👤 Contact :</div>
                  <div class="info-value"><strong>${fullName}</strong></div>
                </div>
                <div class="info-row">
                  <div class="info-label">📧 Email :</div>
                  <div class="info-value"><a href="mailto:${email}">${email}</a></div>
                </div>
                <div class="info-row">
                  <div class="info-label">🏢 Secteur :</div>
                  <div class="info-value">${sector || 'Non spécifié'}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">⚡ Priorité :</div>
                  <div class="info-value priority-medium">${priority || 'Non spécifié'}</div>
                </div>
              </div>

              ${description ? `
              <div class="message-box">
                <h3 style="margin: 0 0 15px 0; color: #374151;">💬 Message du prospect :</h3>
                <p style="margin: 0; line-height: 1.6; color: #1F2937;">${description}</p>
              </div>
              ` : ''}

              <div class="timestamp">
                📅 Reçu le ${new Date().toLocaleString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            <div class="footer">
              <p><strong>🎯 Action recommandée :</strong> Contacter sous 24h pour maximiser la conversion</p>
              <p>📊 Lead automatiquement tracké dans GA4 + Google Sheets</p>
              <p style="margin-top: 20px;">
                <small>✨ Email généré automatiquement par SD Service Portfolio</small>
              </p>
            </div>
          </div>
        </body>
        </html>
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