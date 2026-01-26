import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient, ContactKeys } from '@/lib/redis';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { validateContactForm } from '@/lib/validation';
import { sendContactEmails } from '@/lib/email';
import { logContactSubmission } from '@/lib/sheets';
import type { ContactAPIResponse, ContactAPIError } from '@/types/contact';

const RATE_LIMIT_SUBMISSIONS = 3; // Max submissions per hour
const RATE_LIMIT_WINDOW = 3600; // 1 hour in seconds

/**
 * Check rate limit for IP address
 */
async function checkContactRateLimit(
  redis: ReturnType<typeof getRedisClient>,
  ip: string
): Promise<boolean> {
  const rateLimitKey = ContactKeys.contactRateLimit(ip);
  const currentCount = await redis.get<number>(rateLimitKey);

  if (currentCount !== null && currentCount >= RATE_LIMIT_SUBMISSIONS) {
    return false; // Rate limit exceeded
  }

  // Increment rate limit counter
  if (currentCount === null) {
    await redis.set(rateLimitKey, 1, { ex: RATE_LIMIT_WINDOW });
  } else {
    await redis.incr(rateLimitKey);
  }

  return true; // Within rate limit
}

/**
 * Extract client IP from request headers
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

/**
 * POST /api/contact
 * Handle contact form submission
 */
export async function POST(request: NextRequest) {
  try {
    // Extract client IP
    const ip = getClientIP(request);

    // Parse request body
    const body = await request.json();
    const { name, email, message, turnstileToken } = body;

    // Validate Turnstile token
    if (!turnstileToken) {
      return NextResponse.json<ContactAPIError>(
        { error: 'CAPTCHA verification is required' },
        { status: 400 }
      );
    }

    const turnstileValid = await verifyTurnstileToken(turnstileToken, ip);
    if (!turnstileValid) {
      return NextResponse.json<ContactAPIError>(
        { error: 'Invalid CAPTCHA. Please try again.' },
        { status: 400 }
      );
    }

    // Rate limiting removed per user request

    // Validate and sanitize form data
    const validationResult = validateContactForm({ name, email, message });
    if (!validationResult.valid || !validationResult.data) {
      return NextResponse.json<ContactAPIError>(
        { error: 'Invalid form data', details: validationResult.error },
        { status: 400 }
      );
    }

    // Send emails (CRITICAL PATH - must succeed)
    const emailResult = await sendContactEmails(validationResult.data, ip);
    if (!emailResult.success) {
      throw new Error(`Email send failed: ${emailResult.error}`);
    }

    // Log to Google Sheets (REQUIRED)
    await logContactSubmission({
      timestamp: new Date().toISOString(),
      name: validationResult.data.name,
      email: validationResult.data.email,
      message: validationResult.data.message,
      ipAddress: ip,
      geolocation: 'N/A',
    });

    // Return success
    return NextResponse.json<ContactAPIResponse>({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json<ContactAPIError>(
      {
        error: 'Failed to send message. Please try again.',
        details: process.env.NODE_ENV === 'development'
          ? (error instanceof Error ? error.message : 'Unknown error')
          : undefined,
      },
      { status: 500 }
    );
  }
}
