import { ContactFormData, EmailResult } from '@/types/contact';
import { getEmailConfig } from './env';

/**
 * Create Nodemailer SMTP transporter
 */
async function createEmailTransporter() {
  const nodemailer = await import('nodemailer');
  const config = getEmailConfig();

  return nodemailer.default.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: false, // TLS on port 587
    auth: config.smtp.auth,
  });
}

/**
 * Generate notification email (to site owner)
 */
function generateNotificationEmail(
  data: ContactFormData,
  ipAddress: string
): { subject: string; text: string; html: string } {
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
  });

  const subject = `New Contact Form Submission from ${data.name}`;

  const text = `
New Contact Form Submission

From: ${data.name} (${data.email})
Time: ${timestamp}
IP: ${ipAddress}

---
Message:
${data.message}
---

This message was sent via the contact form at lukeedwards.me
  `.trim();

  const html = `
<h2>New Contact Form Submission</h2>
<p><strong>From:</strong> ${data.name} (${data.email})</p>
<p><strong>Time:</strong> ${timestamp}</p>
<p><strong>IP:</strong> ${ipAddress}</p>
<hr>
<h3>Message:</h3>
<p style="white-space: pre-wrap;">${data.message}</p>
<hr>
<p style="color: #666; font-size: 12px;">
  This message was sent via the contact form at lukeedwards.me
</p>
  `.trim();

  return { subject, text, html };
}

/**
 * Generate confirmation email (to user)
 */
function generateConfirmationEmail(
  userName: string
): { subject: string; text: string } {
  const subject = `Thanks for reaching out, ${userName}!`;

  const text = `
Hi ${userName},

Thanks for getting in touch! I've received your message and will get back to you as soon as possible.

In the meantime, feel free to check out my latest projects at https://lukeedwards.me/projects

Best regards,
Luke Edwards

---
This is an automated confirmation. Please do not reply to this email.
  `.trim();

  return { subject, text };
}

/**
 * Send both notification and confirmation emails
 */
export async function sendContactEmails(
  data: ContactFormData,
  ipAddress: string = 'unknown'
): Promise<EmailResult> {
  const config = getEmailConfig();
  const transporter = await createEmailTransporter();

  let notificationSent = false;
  let confirmationSent = false;
  let lastError: string | undefined;

  try {
    // Send notification email to site owner (CRITICAL)
    const notificationEmail = generateNotificationEmail(data, ipAddress);
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${config.smtp.auth.user}>`,
      to: config.notifications.recipientEmail,
      subject: notificationEmail.subject,
      text: notificationEmail.text,
      html: notificationEmail.html,
    });
    notificationSent = true;

    // Send confirmation email to user (BEST EFFORT)
    try {
      const confirmationEmail = generateConfirmationEmail(data.name);
      await transporter.sendMail({
        from: `"Luke Edwards" <${config.smtp.auth.user}>`,
        to: data.email,
        subject: confirmationEmail.subject,
        text: confirmationEmail.text,
      });
      confirmationSent = true;
    } catch (confirmError) {
      console.error('Failed to send confirmation email:', confirmError);
      // Don't fail overall if confirmation fails
    }

    return {
      success: true,
      notificationSent,
      confirmationSent,
    };
  } catch (error) {
    console.error('Email send error:', error);
    lastError = error instanceof Error ? error.message : 'Unknown error';

    return {
      success: false,
      notificationSent,
      confirmationSent,
      error: lastError,
    };
  }
}
