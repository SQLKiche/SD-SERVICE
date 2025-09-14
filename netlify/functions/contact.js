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
    const { fullName, email, sector, priority, description } = JSON.parse(event.body);
    
    // Basic validation
    if (!fullName || !email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Nom et email requis' })
      };
    }

    // Log the contact request (for now, we'll just simulate success)
    console.log('New contact request:', {
      fullName,
      email,
      sector,
      priority,
      description,
      timestamp: new Date().toISOString()
    });

    // In a real implementation, you would:
    // 1. Send email via service like SendGrid, Nodemailer, etc.
    // 2. Save to database
    // 3. Send confirmation email to user

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Votre demande a été envoyée avec succès. Nous vous contactons sous 24h !',
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Contact form error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter directement.',
        fallback: true
      })
    };
  }
};