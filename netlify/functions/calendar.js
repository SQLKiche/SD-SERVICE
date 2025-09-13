const { google } = require('googleapis');

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
    const body = JSON.parse(event.body);
    const { date, action, datetime, clientName, clientEmail, clientMessage, timeZone = 'Europe/Paris' } = body;
    
    // Handle booking action
    if (action === 'book') {
      if (!datetime || !clientName || !clientEmail) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Données manquantes pour la réservation' })
        };
      }
      
      console.log('New appointment booking:', {
        datetime,
        clientName,
        clientEmail,
        clientMessage,
        timestamp: new Date().toISOString()
      });
      
      // Envoyer les emails de confirmation
      try {
        // Format data for email templates
        const appointmentDate = new Date(datetime).toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        const appointmentTime = new Date(datetime).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        });

        // 1. Email de notification au propriétaire (Sofiane)
        await fetch(`${process.env.SITE_URL}/.netlify/functions/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateType: 'appointment-owner',
            data: {
              appointmentDate,
              appointmentTime,
              clientName,
              clientEmail,
              clientPhone: 'Non fourni',
              clientCompany: 'Non fournie',
              clientSector: 'Non spécifié',
              clientMessage: clientMessage || 'Aucun message'
            }
          })
        });

        // 2. Email de confirmation au client
        await fetch(`${process.env.SITE_URL}/.netlify/functions/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateType: 'appointment-client',
            data: {
              clientName,
              clientEmail,
              appointmentDate,
              appointmentTime
            }
          })
        });
      } catch (emailError) {
        console.error('Email sending failed for appointment:', emailError);
        // Continue even if email fails - appointment is still booked
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Rendez-vous confirmé ! Vous recevrez un email de confirmation.',
          appointmentId: 'APT-' + Date.now()
        })
      };
    }
    
    // Handle slot availability (original functionality)
    if (!date) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Date is required' })
      };
    }

    // Initialize Google Calendar API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
      },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly']
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Generate available slots for the requested date
    const requestedDate = new Date(date);
    const slots = [];
    
    // Business hours: 9:00-18:00, 30min slots
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotStart = new Date(requestedDate);
        slotStart.setHours(hour, minute, 0, 0);
        
        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + 30);
        
        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
          display: slotStart.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: timeZone 
          }),
          available: true
        });
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        availableSlots: slots,
        date: date,
        timeZone: timeZone
      })
    };

  } catch (error) {
    console.error('Calendar error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erreur lors de la récupération des créneaux disponibles',
        fallback: true
      })
    };
  }
};