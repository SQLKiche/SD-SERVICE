const fetch = require('node-fetch');

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
    const { templateType, data } = JSON.parse(event.body);
    
    // Template IDs mapping depuis Brevo
    const templateIds = {
      'contact-form': 1, // ID du template "Formulaire Contact - Notification"
      'client-confirmation': 2, // ID du template "Confirmation Client - Audit"
      'appointment-owner': 3, // ID du template "RDV Calendrier - Notification"  
      'appointment-client': 4 // ID du template "Confirmation RDV - Client"
    };

    // Configuration email selon le type de template
    let emailConfig = {};
    
    switch (templateType) {
      case 'contact-form':
        emailConfig = {
          templateId: templateIds['contact-form'],
          to: [{ email: 'sofiane.dehaffreingue59@gmail.com', name: 'Sofiane' }],
          params: {
            from_name: data.fullName,
            from_email: data.email,
            sector: data.sector,
            priority: data.priority,
            message: data.description,
            timestamp: new Date().toLocaleString('fr-FR')
          }
        };
        break;
        
      case 'client-confirmation':
        emailConfig = {
          templateId: templateIds['client-confirmation'],
          to: [{ email: data.email, name: data.fullName }],
          params: {
            to_name: data.fullName,
            sector: data.sector,
            priority: data.priority
          }
        };
        break;
        
      case 'appointment-owner':
        emailConfig = {
          templateId: templateIds['appointment-owner'],
          to: [{ email: 'sofiane.dehaffreingue59@gmail.com', name: 'Sofiane' }],
          params: {
            appointment_date: data.appointmentDate,
            appointment_time: data.appointmentTime,
            client_name: data.clientName,
            client_email: data.clientEmail,
            client_phone: data.clientPhone || 'Non fourni',
            client_company: data.clientCompany || 'Non fournie',
            client_sector: data.clientSector,
            client_message: data.clientMessage
          }
        };
        break;
        
      case 'appointment-client':
        emailConfig = {
          templateId: templateIds['appointment-client'],
          to: [{ email: data.clientEmail, name: data.clientName }],
          params: {
            client_name: data.clientName,
            appointment_date: data.appointmentDate,
            appointment_time: data.appointmentTime
          }
        };
        break;
        
      default:
        throw new Error('Type de template non reconnu');
    }

    // Appel API Brevo
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Api-Key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        templateId: emailConfig.templateId,
        to: emailConfig.to,
        params: emailConfig.params
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Brevo API error:', errorData);
      throw new Error(`Brevo API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Email envoyé avec succès',
        messageId: result.messageId
      })
    };

  } catch (error) {
    console.error('Email sending error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erreur lors de l\'envoi de l\'email',
        details: error.message
      })
    };
  }
};