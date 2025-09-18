// ==========================================
// GOOGLE APPS SCRIPT POUR TRACKING AUTOMATIQUE
// À copier dans Google Apps Script
// ==========================================

function doPost(e) {
  try {
    // Parse les données reçues
    const data = JSON.parse(e.postData.contents);

    // ID de votre Google Sheet (remplacez par votre ID)
    const SHEET_ID = 'VOTRE_GOOGLE_SHEET_ID';
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

    // Si c'est la première fois, créer les headers
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'Page',
        'Event Type',
        'Event Value',
        'URL',
        'Referrer',
        'User Agent',
        'Screen Resolution',
        'Viewport',
        'Language',
        'Session ID'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

      // Style des headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
    }

    // Ajouter les données
    const row = [
      data.timestamp,
      data.page,
      data.eventType,
      data.eventValue,
      data.url,
      data.referrer,
      data.userAgent,
      data.screenResolution,
      data.viewport,
      data.language,
      data.sessionId
    ];

    sheet.appendRow(row);

    // Auto-resize columns pour la lisibilité
    sheet.autoResizeColumns(1, 11);

    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.toString());

    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Fonction pour créer un dashboard automatique
function createDashboard() {
  const SHEET_ID = 'VOTRE_GOOGLE_SHEET_ID';
  const ss = SpreadsheetApp.openById(SHEET_ID);

  // Créer une nouvelle feuille pour le dashboard
  let dashboardSheet;
  try {
    dashboardSheet = ss.getSheetByName('Dashboard');
  } catch (e) {
    dashboardSheet = ss.insertSheet('Dashboard');
  }

  // Clear existing content
  dashboardSheet.clear();

  // Headers du dashboard
  const dashboardHeaders = [
    ['ANALYTICS DASHBOARD - MON HISTOIRE', '', '', ''],
    ['', '', '', ''],
    ['MÉTRIQUES PRINCIPALES', '', '', ''],
    ['Total Visiteurs', '=COUNTA(UNIQUE(FILTER(Feuille1!K:K,Feuille1!K:K<>"")))', '', ''],
    ['Pages Vues', '=COUNTIF(Feuille1!C:C,"page_view")', '', ''],
    ['Temps Moyen (sec)', '=AVERAGEIF(Feuille1!C:C,"time_on_page",VALUE(LEFT(Feuille1!D:D,LEN(Feuille1!D:D)-1)))', '', ''],
    ['Clics Sociaux', '=COUNTIF(Feuille1!C:C,"social_click")', '', ''],
    ['', '', '', ''],
    ['TOP ÉVÉNEMENTS', 'Nombre', '', ''],
  ];

  dashboardSheet.getRange(1, 1, dashboardHeaders.length, 4).setValues(dashboardHeaders);

  // Style du dashboard
  dashboardSheet.getRange(1, 1).setFontSize(16).setFontWeight('bold').setBackground('#1a73e8').setFontColor('white');
  dashboardSheet.getRange(3, 1).setFontWeight('bold').setBackground('#e8f0fe');
  dashboardSheet.getRange(9, 1, 1, 2).setFontWeight('bold').setBackground('#e8f0fe');

  // Auto-resize
  dashboardSheet.autoResizeColumns(1, 4);

  Logger.log('Dashboard créé avec succès!');
}