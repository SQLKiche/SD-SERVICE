// Vercel API Route for Contact Form
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
      return res.status(400).json({ error: 'Nom et email requis' });
    }

    // Log the contact request
    console.log('New contact request:', {
      fullName,
      email,
      sector,
      priority,
      description,
      timestamp: new Date().toISOString()
    });

    // TODO: Integrate with Brevo email service
    // Send emails via send-email API route

    return res.status(200).json({
      success: true,
      message: 'Votre demande a été envoyée avec succès. Nous vous contactons sous 24h !',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Contact form error:', error);

    return res.status(500).json({
      error: 'Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter directement.',
      fallback: true
    });
  }
}