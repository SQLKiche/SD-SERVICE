function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // ID de ton Google Sheet CONVERSIONS
    const SHEET_ID = '1FPKw-AemkB5JRk-MjuJXPNo4eLy9tDGY7gDB-2_mAZU';
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

    // Headers si c'est la première fois
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'Conversion Type',
        'Value',
        'Source',
        'Page',
        'User Details',
        'Session ID',
        'URL',
        'Referrer'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#ff6b35');
      headerRange.setFontColor('white');
      headerRange.setFontWeight('bold');
    }

    // Ajouter la conversion avec timestamp français correct
    const row = [
      new Date().toLocaleString('fr-FR', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      data.type || data.eventType,
      data.value || data.eventValue,
      data.source || 'Website',
      data.page || 'Site Principal',
      data.details || JSON.stringify(data.userDetails || {}),
      data.sessionId,
      data.url,
      data.referrer
    ];

    sheet.appendRow(row);
    sheet.autoResizeColumns(1, 9);

    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Conversion Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function testConversion() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        type: 'form_submit',
        value: 'contact_form',
        source: 'Test Manual',
        page: 'Site Principal',
        details: 'Test conversion depuis Apps Script',
        timestamp: new Date().toLocaleString('fr-FR'),
        sessionId: 'test-conversion-123',
        url: 'https://test.com',
        referrer: 'Direct'
      })
    }
  };

  const result = doPost(testData);
  console.log('Test conversion:', result.getContent());
  return result;
}