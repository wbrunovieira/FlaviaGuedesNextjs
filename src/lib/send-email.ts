// src/lib/send-email.ts
// Thin wrapper around Resend. No-ops (with a warning) when RESEND_API_KEY is
// not configured, so email problems can NEVER break a purchase.
import { Resend } from 'resend';
import type { EmailContent } from './email';

const FROM =
  process.env.EMAIL_FROM ||
  'Flavia Guedes <giftcard@flaviaguedes.com>';

export type Attachment = {
  filename: string;
  content: Buffer;
};

export async function sendEmail(
  content: EmailContent,
  attachments?: Attachment[]
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      '[email] RESEND_API_KEY not set — skipping send to',
      content.to
    );
    return;
  }
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM,
    to: content.to,
    subject: content.subject,
    html: content.html,
    replyTo: content.replyTo,
    attachments: attachments?.map(a => ({
      filename: a.filename,
      content: a.content,
    })),
  });
  if (error) {
    throw new Error(
      `Resend error: ${JSON.stringify(error)}`
    );
  }
}
