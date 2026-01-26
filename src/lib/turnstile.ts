import { TurnstileResponse } from '@/types/contact';
import { getTurnstileConfig } from './env';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Verify Cloudflare Turnstile token
 * @param token - Token from client-side Turnstile widget
 * @param ip - Client IP address (optional)
 */
export async function verifyTurnstileToken(
  token: string,
  ip?: string
): Promise<boolean> {
  try {
    const config = getTurnstileConfig();

    const formData = new URLSearchParams();
    formData.append('secret', config.secretKey);
    formData.append('response', token);
    if (ip) {
      formData.append('remoteip', ip);
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      console.error('Turnstile verification request failed:', response.status);
      return false;
    }

    const data: TurnstileResponse = await response.json();

    if (!data.success) {
      console.error('Turnstile verification failed:', data['error-codes']);
    }

    return data.success;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}
