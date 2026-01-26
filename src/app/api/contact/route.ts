import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient, ContactKeys } from '@/lib/redis';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { validateContactForm } from '@/lib/validation';
import { sendContactEmails } from '@/lib/email';
import { logContactSubmission } from '@/lib/sheets';
import { getIPGeolocation } from '@/lib/geolocation';
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
 * Validate IP address format (IPv4 or IPv6)
 */
function isValidIP(ip: string): boolean {
  if (!ip || ip === 'unknown') {
    return false;
  }
  
  // IPv4 pattern: 0.0.0.0 to 255.255.255.255
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  // IPv6 pattern (simplified - allows compressed and expanded forms)
  const ipv6Pattern = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$|^::1$|^::$/;
  
  if (ipv4Pattern.test(ip)) {
    // Validate IPv4 octets are in valid range
    const parts = ip.split('.');
    return parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  }
  
  return ipv6Pattern.test(ip);
}

/**
 * Extract client IP from request headers with validation
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // Take first IP from comma-separated list
    const firstIP = forwarded.split(',')[0].trim();
    if (isValidIP(firstIP)) {
      return firstIP;
    }
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP && isValidIP(realIP)) {
    return realIP;
  }
  
  // Fallback to 'unknown' if no valid IP found
  return 'unknown';
}

/**
 * Validate and sanitize client-provided geolocation
 * @param geolocation - Client-provided geolocation string
 * @returns Sanitized geolocation or null if invalid
 */
function validateGeolocation(geolocation: string | null | undefined): string | null {
  if (!geolocation || typeof geolocation !== 'string') {
    return null;
  }

  const trimmed = geolocation.trim();
  
  // Length limit (200 characters)
  if (trimmed.length > 200) {
    return null;
  }

  // Only allow alphanumeric, spaces, commas, hyphens, periods, and parentheses
  // This matches typical location formats like "City, State, Country"
  const validPattern = /^[a-zA-Z0-9\s,\-\.()]+$/;
  if (!validPattern.test(trimmed)) {
    return null;
  }

  return trimmed;
}

/**
 * POST /api/contact
 * Handle contact form submission
 */
export async function POST(request: NextRequest) {
  try {
    // Validate Content-Type header
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json<ContactAPIError>(
        { error: 'Content-Type must be application/json' },
        { status: 415 }
      );
    }

    // Extract client IP
    const ip = getClientIP(request);

    // Parse request body
    const body = await request.json();
    const { name, email, message, turnstileToken, geolocation: clientGeolocation } = body;

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

    // Determine geolocation: use client-provided or fallback to IP-based lookup
    // Validate client-provided geolocation first
    let finalGeolocation = validateGeolocation(clientGeolocation);
    
    // If no valid client geolocation, try IP-based geolocation
    if (!finalGeolocation) {
      try {
        finalGeolocation = await getIPGeolocation(ip);
      } catch (error) {
        console.error('IP geolocation lookup failed:', error);
      }
    }

    // Log to Google Sheets (REQUIRED)
    await logContactSubmission({
      timestamp: new Date().toISOString(),
      name: validationResult.data.name,
      email: validationResult.data.email,
      message: validationResult.data.message,
      ipAddress: ip,
      geolocation: finalGeolocation || 'N/A',
    });

    // Return success
    return NextResponse.json<ContactAPIResponse>({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
    });
  } catch (error) {
    // Log error server-side for debugging
    console.error('Contact form error:', error);
    
    // Only expose error details in development mode
    // Explicitly check for development to prevent accidental disclosure
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json<ContactAPIError>(
      {
        error: 'Failed to send message. Please try again.',
        // Only include details in development - never in production
        details: isDevelopment && error instanceof Error
          ? error.message
          : undefined,
      },
      { status: 500 }
    );
  }
}
