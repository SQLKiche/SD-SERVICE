// Vercel API Route for Google Calendar
import { google } from 'googleapis';

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
    const { date, action, datetime, clientName, clientEmail, clientPhone, clientCompany, clientSector, clientMessage, timeZone = 'Europe/Paris' } = req.body;

    // Handle booking action
    if (action === 'book') {
      if (!datetime || !clientName || !clientEmail) {
        return res.status(400).json({ error: 'Données manquantes pour la réservation' });
      }

      console.log('🚀 NOUVEAU TEST - New appointment booking:', {
        datetime,
        clientName,
        clientEmail,
        clientPhone,
        clientCompany,
        clientSector,
        clientMessage,
        timestamp: new Date().toISOString()
      });

      // Parse credentials from environment variable
      console.log('🔍 DEBUG - Variables d\'environnement disponibles:', {
        hasBrevoKey: !!process.env.BREVO_API_KEY,
        hasGoogleCalendarId: !!process.env.GOOGLE_CALENDAR_ID,
        hasGoogleCredentials: !!process.env.GOOGLE_CALENDAR_CREDENTIALS,
        calendarId: process.env.GOOGLE_CALENDAR_ID
      });

      if (!process.env.GOOGLE_CALENDAR_CREDENTIALS) {
        throw new Error('GOOGLE_CALENDAR_CREDENTIALS manquant');
      }

      const credentials = JSON.parse(process.env.GOOGLE_CALENDAR_CREDENTIALS);
      console.log('🔍 DEBUG - Credentials parsées:', {
        type: credentials.type,
        project_id: credentials.project_id,
        client_email: credentials.client_email
      });

      // Initialize Google Calendar API for writing
      const auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: ['https://www.googleapis.com/auth/calendar']
      });

      const calendar = google.calendar({ version: 'v3', auth });

      // Parse datetime and create event
      const startDate = new Date(datetime);
      const endDate = new Date(startDate.getTime() + 15 * 60000); // 15 minutes later

      // Format date and time for emails
      const appointmentDate = startDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const appointmentTime = startDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });

      // Create Google Calendar event
      const event = {
        summary: `Audit Gratuit - ${clientName}`,
        description: `Client: ${clientName}
Email: ${clientEmail}
Téléphone: ${clientPhone || 'Non fourni'}
Entreprise: ${clientCompany || 'Non fournie'}
Secteur: ${clientSector}

Besoins exprimés:
${clientMessage}

--
Automatiquement créé via sofiane-automation.com`,
        start: {
          dateTime: startDate.toISOString(),
          timeZone: timeZone,
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: timeZone,
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 60 },
            { method: 'popup', minutes: 15 }
          ]
        }
      };

      // Add event to Google Calendar
      console.log('🔍 DEBUG - Tentative création événement dans calendrier:', process.env.GOOGLE_CALENDAR_ID);
      console.log('🔍 DEBUG - Données événement:', {
        summary: event.summary,
        start: event.start,
        end: event.end
      });

      const calendarResponse = await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        resource: event,
      });

      console.log('✅ Événement créé dans Google Calendar:', {
        id: calendarResponse.data.id,
        status: calendarResponse.status,
        link: calendarResponse.data.htmlLink
      });

      // Send notification emails
      try {
        // Email de notification pour toi (owner)
        await fetch(`${req.headers.origin}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateType: 'contact-form',
            data: {
              from_name: `RDV Confirmé - ${clientName}`,
              from_email: clientEmail,
              sector: clientSector,
              priority: `RDV le ${appointmentDate} à ${appointmentTime}`,
              message: `NOUVEAU RDV CONFIRMÉ\n\nClient: ${clientName}\nEmail: ${clientEmail}\nTéléphone: ${clientPhone || 'Non fourni'}\nEntreprise: ${clientCompany || 'Non fournie'}\nSecteur: ${clientSector}\n\nDate: ${appointmentDate}\nHeure: ${appointmentTime}\n\nBesoins:\n${clientMessage}`
            }
          })
        });

        // Email de confirmation pour le client
        await fetch(`${req.headers.origin}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateType: 'contact-form',
            data: {
              from_name: `Confirmation RDV - SD Service`,
              from_email: 'sofiane.dehaffreingue59@gmail.com',
              sector: 'Confirmation',
              priority: `RDV le ${appointmentDate} à ${appointmentTime}`,
              message: `Bonjour ${clientName},\n\nVotre rendez-vous de 15 minutes est confirmé :\n\nDate: ${appointmentDate}\nHeure: ${appointmentTime}\n\nJe vous contacterai à l'heure prévue.\n\nÀ bientôt !\nSofiane Dehaffreingue\nSD Service`
            }
          })
        });

        console.log('✅ Emails de confirmation envoyés');

      } catch (emailError) {
        console.error('❌ Erreur envoi emails:', emailError);
        // Continue anyway, don't fail the appointment creation
      }

      // 🎯 TRACKING CONVERSION RDV vers Google Sheets
      try {
        await fetch('https://script.google.com/macros/s/AKfycbwrN5i7qTBq3Lg_O40ZgsFg-fShEyywSXXxSmXcRYJrki5SH8vLkTXpfBLNMvdiq4NV/exec', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventType: 'calendar_booking_completed',
            type: 'calendar_booking_completed',
            value: 500, // Valeur élevée car RDV = prospect chaud
            source: 'calendar_booking',
            page: 'Site Principal',
            details: `RDV confirmé avec ${clientName} le ${appointmentDate} à ${appointmentTime}`,
            timestamp: new Date().toLocaleString('fr-FR'),
            url: req.headers.origin || 'https://sd-service.vercel.app',
            email: clientEmail,
            fullName: clientName,
            clientPhone: clientPhone || 'Non fourni',
            clientCompany: clientCompany || 'Non fournie',
            sector: clientSector,
            appointmentDate: appointmentDate,
            appointmentTime: appointmentTime
          })
        });
        console.log('✅ Conversion RDV trackée vers Google Sheets');
      } catch (trackingError) {
        console.error('❌ Erreur tracking conversion RDV:', trackingError);
      }

      return res.status(200).json({
        success: true,
        message: 'Rendez-vous confirmé ! Vous recevrez un email de confirmation.',
        appointmentId: calendarResponse.data.id,
        eventLink: calendarResponse.data.htmlLink
      });
    }

    // Handle slot availability (original functionality)
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    // Parse credentials for reading availability
    const credentials = JSON.parse(process.env.GOOGLE_CALENDAR_CREDENTIALS);

    // Initialize Google Calendar API for reading
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly']
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Get existing events for the requested date
    const requestedDate = new Date(date);
    const dayStart = new Date(requestedDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(requestedDate);
    dayEnd.setHours(23, 59, 59, 999);

    const existingEvents = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const bookedSlots = existingEvents.data.items || [];

    // Generate available slots for the requested date
    const slots = [];

    // Business hours: 9:00-18:00, 30min slots
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const slotStart = new Date(requestedDate);
        slotStart.setHours(hour, minute, 0, 0);

        const slotEnd = new Date(slotStart);
        slotEnd.setMinutes(slotEnd.getMinutes() + 30);

        // Check if this slot conflicts with existing events
        const isAvailable = !bookedSlots.some(event => {
          const eventStart = new Date(event.start.dateTime || event.start.date);
          const eventEnd = new Date(event.end.dateTime || event.end.date);

          return (slotStart < eventEnd && slotEnd > eventStart);
        });

        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
          display: slotStart.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: timeZone
          }),
          available: isAvailable
        });
      }
    }

    return res.status(200).json({
      availableSlots: slots,
      date: date,
      timeZone: timeZone
    });

  } catch (error) {
    console.error('❌ ERREUR CALENDAR COMPLÈTE:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return res.status(500).json({
      error: 'Erreur lors de la gestion du calendrier',
      details: error.message,
      stack: error.stack,
      fallback: true
    });
  }
}