export interface ContactEnvConfig {
  smtp: {
    host: string;
    port: number;
    auth: { user: string; pass: string };
  };
  turnstile: {
    siteKey: string;
    secretKey: string;
  };
  google: {
    sheetId: string;
    serviceAccountEmail: string;
    privateKey: string;
  };
  redis: {
    url: string;
    token: string;
  };
  notifications: {
    recipientEmail: string;
  };
}

export function getTurnstileConfig() {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('Missing TURNSTILE_SECRET_KEY environment variable');
  }
  return {
    siteKey: process.env.NEXT_PUBLIC_TURNSTILE_KEY!,
    secretKey,
  };
}

export function getEmailConfig() {
  const required = {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    CONTACT_SENDER_EMAIL: process.env.CONTACT_SENDER_EMAIL,
    CONTACT_SENDER_PASSWORD: process.env.CONTACT_SENDER_PASSWORD,
    CONTACT_NOTIFICATION_EMAIL: process.env.CONTACT_NOTIFICATION_EMAIL,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required email environment variables: ${missing.join(', ')}`);
  }

  return {
    smtp: {
      host: required.SMTP_HOST!,
      port: parseInt(required.SMTP_PORT!, 10),
      auth: {
        user: required.CONTACT_SENDER_EMAIL!,
        pass: required.CONTACT_SENDER_PASSWORD!,
      },
    },
    notifications: {
      recipientEmail: required.CONTACT_NOTIFICATION_EMAIL!,
    },
  };
}

export function getContactEnvConfig(): ContactEnvConfig {
  const required = {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    CONTACT_SENDER_EMAIL: process.env.CONTACT_SENDER_EMAIL,
    CONTACT_SENDER_PASSWORD: process.env.CONTACT_SENDER_PASSWORD,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    SHEET_ID: process.env.SHEET_ID,
    SHEETS_SERVICE_ACCOUNT_EMAIL: process.env.SHEETS_SERVICE_ACCOUNT_EMAIL,
    SHEETS_JSON_PRIVATE_KEY: process.env.SHEETS_JSON_PRIVATE_KEY,
    KV_REST_API_URL: process.env.LUKE_KV_KV_REST_API_URL || process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: process.env.LUKE_KV_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN,
    CONTACT_NOTIFICATION_EMAIL: process.env.CONTACT_NOTIFICATION_EMAIL,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    smtp: {
      host: required.SMTP_HOST!,
      port: parseInt(required.SMTP_PORT!, 10),
      auth: {
        user: required.CONTACT_SENDER_EMAIL!,
        pass: required.CONTACT_SENDER_PASSWORD!,
      },
    },
    turnstile: {
      siteKey: process.env.NEXT_PUBLIC_TURNSTILE_KEY!,
      secretKey: required.TURNSTILE_SECRET_KEY!,
    },
    google: {
      sheetId: required.SHEET_ID!,
      serviceAccountEmail: required.SHEETS_SERVICE_ACCOUNT_EMAIL!,
      privateKey: required.SHEETS_JSON_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    },
    redis: {
      url: required.KV_REST_API_URL!,
      token: required.KV_REST_API_TOKEN!,
    },
    notifications: {
      recipientEmail: required.CONTACT_NOTIFICATION_EMAIL!,
    },
  };
}
