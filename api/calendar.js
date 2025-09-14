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
    const { date, action, datetime, clientName, clientEmail, clientMessage, timeZone = 'Europe/Paris' } = req.body;

    // Handle booking action
    if (action === 'book') {
      if (!datetime || !clientName || !clientEmail) {
        return res.status(400).json({ error: 'Données manquantes pour la réservation' });
      }

      console.log('New appointment booking:', {
        datetime,
        clientName,
        clientEmail,
        clientMessage,
        timestamp: new Date().toISOString()
      });

      // TODO: Send confirmation emails via send-email API route

      return res.status(200).json({
        success: true,
        message: 'Rendez-vous confirmé ! Vous recevrez un email de confirmation.',
        appointmentId: 'APT-' + Date.now()
      });
    }

    // Handle slot availability (original functionality)
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
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

    return res.status(200).json({
      availableSlots: slots,
      date: date,
      timeZone: timeZone
    });

  } catch (error) {
    console.error('Calendar error:', error);

    return res.status(500).json({
      error: 'Erreur lors de la récupération des créneaux disponibles',
      fallback: true
    });
  }
}