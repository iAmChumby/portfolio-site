import { google } from 'googleapis';
import { SheetsLogEntry } from '@/types/contact';
import { getContactEnvConfig } from './env';

/**
 * Get authenticated Google Sheets client
 */
function getGoogleSheetsClient() {
  const config = getContactEnvConfig();

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: config.google.serviceAccountEmail,
      private_key: config.google.privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

/**
 * Log contact form submission to Google Sheets
 * Non-blocking: errors are logged but don't throw
 */
export async function logContactSubmission(
  entry: SheetsLogEntry
): Promise<void> {
  try {
    const config = getContactEnvConfig();
    const sheets = getGoogleSheetsClient();

    const values = [[
      entry.timestamp,
      entry.name,
      entry.email,
      entry.message,
      entry.ipAddress,
      entry.geolocation,
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: config.google.sheetId,
      range: 'Sheet1!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    console.log('Successfully logged to Google Sheets');
  } catch (error) {
    console.error('Failed to log to Google Sheets (non-blocking):', error);
    // Don't throw - this is non-blocking
  }
}
