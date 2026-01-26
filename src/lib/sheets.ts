import { SheetsLogEntry } from '@/types/contact';
import { getContactEnvConfig } from './env';

/**
 * Get authenticated Google Sheets client
 */
async function getGoogleSheetsClient() {
  const { google } = await import('googleapis');
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
 * Sanitize value to prevent Google Sheets formula injection
 * Prefixes values starting with =, +, -, @ with single quote
 */
function sanitizeSheetValue(value: string): string {
  if (!value || typeof value !== 'string') {
    return value;
  }
  // Prefix formulas with single quote to force text interpretation
  const trimmed = value.trim();
  if (trimmed.startsWith('=') || trimmed.startsWith('+') || trimmed.startsWith('-') || trimmed.startsWith('@')) {
    return `'${value}`;
  }
  return value;
}

/**
 * Log contact form submission to Google Sheets
 * Non-blocking: errors are logged but don't throw
 */
export async function logContactSubmission(
  entry: SheetsLogEntry
): Promise<void> {
  const config = getContactEnvConfig();
  const sheets = await getGoogleSheetsClient();

  // Sanitize all user-provided values to prevent formula injection
  const values = [[
    entry.timestamp,
    sanitizeSheetValue(entry.name),
    sanitizeSheetValue(entry.email),
    sanitizeSheetValue(entry.message),
    sanitizeSheetValue(entry.ipAddress),
    sanitizeSheetValue(entry.geolocation),
  ]];

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.google.sheetId,
    range: 'Sheet1!A:F',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });

  console.log('Successfully logged to Google Sheets');
}
