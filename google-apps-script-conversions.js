// ==========================================
// GOOGLE APPS SCRIPT - CONVERSIONS BUSINESS
// Script spécialisé pour tracker les conversions
// ==========================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // ID de votre Google Sheet CONVERSIONS (créer un sheet séparé)
    const CONVERSIONS_SHEET_ID = 'VOTRE_SHEET_CONVERSIONS_ID';
    const ss = SpreadsheetApp.openById(CONVERSIONS_SHEET_ID);

    // Obtenir ou créer la feuille "Conversions"
    let sheet;
    try {
      sheet = ss.getSheetByName('Conversions');
    } catch (e) {
      sheet = ss.insertSheet('Conversions');
    }

    // Headers pour le tracking des conversions
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'Type Conversion',
        'Valeur (€)',
        'Source',
        'Détails',
        'URL',
        'Referrer',
        'User Agent',
        'Session ID',
        'Action Supplémentaire'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

      // Style premium pour les headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#1a73e8');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
      headerRange.setFontSize(11);
    }

    // Ajouter la conversion
    const row = [
      data.timestamp,
      data.type,
      data.value || 0,
      data.source,
      data.details,
      data.url,
      data.referrer,
      data.userAgent,
      data.sessionId,
      data.actionType || data.formId || data.buttonText || ''
    ];

    sheet.appendRow(row);

    // Coloration conditionnelle pour les types de conversion
    const lastRow = sheet.getLastRow();
    const typeCell = sheet.getRange(lastRow, 2);

    switch (data.type) {
      case 'contact_form_submission':
        typeCell.setBackground('#d4edda'); // Vert clair
        break;
      case 'calendar_booking_completed':
        typeCell.setBackground('#d1ecf1'); // Bleu clair
        break;
      case 'chatbot_opened':
        typeCell.setBackground('#fff3cd'); // Jaune clair
        break;
      case 'phone_call_intent':
        typeCell.setBackground('#f8d7da'); // Rouge clair
        break;
      default:
        typeCell.setBackground('#f8f9fa'); // Gris clair
    }

    // Auto-resize columns
    sheet.autoResizeColumns(1, 10);

    // Notification Slack/Email pour conversions importantes
    if (data.value >= 500) {
      sendHighValueConversionAlert(data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({success: true, conversion: data.type}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Conversion Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Fonction pour créer le dashboard des conversions
function createConversionDashboard() {
  const CONVERSIONS_SHEET_ID = 'VOTRE_SHEET_CONVERSIONS_ID';
  const ss = SpreadsheetApp.openById(CONVERSIONS_SHEET_ID);

  // Créer feuille Dashboard
  let dashboardSheet;
  try {
    dashboardSheet = ss.getSheetByName('Dashboard Conversions');
  } catch (e) {
    dashboardSheet = ss.insertSheet('Dashboard Conversions');
  }

  dashboardSheet.clear();

  // Dashboard des conversions
  const dashboardData = [
    ['🎯 DASHBOARD CONVERSIONS - SD SERVICE', '', '', '', ''],
    ['', '', '', '', ''],
    ['📊 MÉTRIQUES PRINCIPALES', '', '', '', ''],
    ['Total Conversions', '=COUNTA(Conversions!A:A)-1', '', '', ''],
    ['Valeur Totale (€)', '=SUM(Conversions!C:C)', '', '', ''],
    ['Conversion Moyenne (€)', '=AVERAGE(Conversions!C:C)', '', '', ''],
    ['Taux Contact/Visite', '=COUNTIF(Conversions!B:B,"contact_form_submission")/COUNTIF(Analytics!C:C,"page_view")*100&"%"', '', '', ''],
    ['', '', '', '', ''],
    ['🎯 TOP CONVERSIONS', 'Nombre', 'Valeur Totale', '', ''],
    ['Formulaires Contact', '=COUNTIF(Conversions!B:B,"contact_form_submission")', '=SUMIF(Conversions!B:B,"contact_form_submission",Conversions!C:C)', '', ''],
    ['Calendrier Réservé', '=COUNTIF(Conversions!B:B,"calendar_booking_completed")', '=SUMIF(Conversions!B:B,"calendar_booking_completed",Conversions!C:C)', '', ''],
    ['Chatbot Ouvert', '=COUNTIF(Conversions!B:B,"chatbot_opened")', '=SUMIF(Conversions!B:B,"chatbot_opened",Conversions!C:C)', '', ''],
    ['Appels Téléphone', '=COUNTIF(Conversions!B:B,"phone_call_intent")', '=SUMIF(Conversions!B:B,"phone_call_intent",Conversions!C:C)', '', ''],
    ['', '', '', '', ''],
    ['📱 CONVERSIONS PAR SOURCE', 'Nombre', '', '', ''],
    ['Site Principal', '=COUNTIFS(Conversions!D:D,"*form*")+COUNTIFS(Conversions!D:D,"*calendar*")', '', '', ''],
    ['Chatbot', '=COUNTIF(Conversions!D:D,"chatbot*")', '', '', ''],
    ['Mobile (Tel/Email)', '=COUNTIF(Conversions!D:D,"phone*")+COUNTIF(Conversions!D:D,"email*")', '', '', ''],
    ['', '', '', '', ''],
    ['📈 TENDANCES (7 derniers jours)', '', '', '', ''],
    ['Conversions Aujourd\'hui', '=COUNTIFS(Conversions!A:A,">="&TODAY(),Conversions!A:A,"<"&TODAY()+1)', '', '', ''],
    ['Conversions Hier', '=COUNTIFS(Conversions!A:A,">="&TODAY()-1,Conversions!A:A,"<"&TODAY())', '', '', ''],
    ['Conversions Cette Semaine', '=COUNTIFS(Conversions!A:A,">="&TODAY()-7)', '', '', '']
  ];

  dashboardSheet.getRange(1, 1, dashboardData.length, 5).setValues(dashboardData);

  // Style du dashboard
  dashboardSheet.getRange(1, 1).setFontSize(16).setBackground('#1a73e8').setFontColor('white').setFontWeight('bold');
  dashboardSheet.getRange(3, 1).setBackground('#e8f0fe').setFontWeight('bold');
  dashboardSheet.getRange(9, 1, 1, 3).setBackground('#e8f0fe').setFontWeight('bold');
  dashboardSheet.getRange(15, 1, 1, 2).setBackground('#e8f0fe').setFontWeight('bold');
  dashboardSheet.getRange(19, 1).setBackground('#e8f0fe').setFontWeight('bold');

  // Auto-resize
  dashboardSheet.autoResizeColumns(1, 5);

  Logger.log('Dashboard des conversions créé !');
}

// Notification pour conversions de haute valeur
function sendHighValueConversionAlert(conversionData) {
  // Remplacer par votre webhook Slack ou email
  const SLACK_WEBHOOK = 'VOTRE_WEBHOOK_SLACK';

  const message = {
    text: `🎯 CONVERSION IMPORTANTE !`,
    attachments: [{
      color: 'good',
      fields: [
        { title: 'Type', value: conversionData.type, short: true },
        { title: 'Valeur', value: `${conversionData.value}€`, short: true },
        { title: 'Source', value: conversionData.source, short: true },
        { title: 'Détails', value: conversionData.details, short: false }
      ]
    }]
  };

  if (SLACK_WEBHOOK && SLACK_WEBHOOK !== 'VOTRE_WEBHOOK_SLACK') {
    try {
      UrlFetchApp.fetch(SLACK_WEBHOOK, {
        method: 'POST',
        contentType: 'application/json',
        payload: JSON.stringify(message)
      });
    } catch (e) {
      Logger.log('Erreur notification Slack: ' + e.toString());
    }
  }
}

// Fonction pour exporter les conversions mensuelles
function exportMonthlyConversions() {
  const CONVERSIONS_SHEET_ID = 'VOTRE_SHEET_CONVERSIONS_ID';
  const ss = SpreadsheetApp.openById(CONVERSIONS_SHEET_ID);
  const sheet = ss.getSheetByName('Conversions');

  // Créer un rapport mensuel
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const data = sheet.getDataRange().getValues();
  const monthlyData = data.filter(row => {
    if (row[0] === 'Timestamp') return true; // Headers
    const date = new Date(row[0]);
    return date >= firstDayOfMonth;
  });

  // Créer nouvelle feuille pour le rapport mensuel
  const monthName = today.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  let reportSheet;
  try {
    reportSheet = ss.getSheetByName(`Rapport ${monthName}`);
  } catch (e) {
    reportSheet = ss.insertSheet(`Rapport ${monthName}`);
  }

  reportSheet.clear();
  reportSheet.getRange(1, 1, monthlyData.length, monthlyData[0].length).setValues(monthlyData);

  Logger.log(`Rapport mensuel créé: ${monthName}`);
}