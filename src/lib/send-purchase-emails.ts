// src/lib/send-purchase-emails.ts
// Resilient + observable sending of the two purchase emails (buyer + owner).
//
// Guarantees:
//  - A failure to render the PNG attachment NEVER drops the buyer email — it
//    falls back to sending the HTML without the attachment.
//  - Buyer and owner emails are sent independently — one failing does not
//    block the other.
//  - Returns a status object so the caller can PERSIST the outcome (e.g. to
//    Firestore), making silent failures visible instead of log-only.
import type { EmailContent } from './email';
import { sendEmail } from './send-email';

export type DeliveryStatus =
  | 'sent'
  | 'sent_without_attachment'
  | 'skipped'
  | 'failed';

export type PurchaseEmailStatus = {
  buyer: DeliveryStatus;
  owner: 'sent' | 'failed';
  errors: string[];
  at: string; // ISO timestamp
};

export async function sendPurchaseEmails(params: {
  label: string; // for logs, e.g. 'gift card'
  buyer: EmailContent | null;
  owner: EmailContent;
  attachment?: {
    filename: string;
    render: () => Promise<Buffer>;
  };
}): Promise<PurchaseEmailStatus> {
  const { label, buyer, owner, attachment } = params;
  const errors: string[] = [];
  let buyerStatus: DeliveryStatus = 'skipped';

  // ---- Buyer email (with attachment, falling back to no attachment) ----
  if (buyer) {
    let attachments:
      | { filename: string; content: Buffer }[]
      | undefined;

    if (attachment) {
      try {
        attachments = [
          {
            filename: attachment.filename,
            content: await attachment.render(),
          },
        ];
      } catch (e) {
        const msg = `[email] ${label} attachment render failed (sending without it): ${
          (e as Error).message
        }`;
        console.error(msg);
        errors.push(msg);
        attachments = undefined; // fall back: still send the HTML
      }
    }

    try {
      await sendEmail(buyer, attachments);
      buyerStatus = attachments
        ? 'sent'
        : attachment
          ? 'sent_without_attachment'
          : 'sent';
    } catch (e) {
      const msg = `[email] ${label} buyer email failed (to ${buyer.to}): ${
        (e as Error).message
      }`;
      console.error(msg);
      errors.push(msg);
      buyerStatus = 'failed';
    }
  }

  // ---- Owner notification (independent of the buyer email) ----
  let ownerStatus: 'sent' | 'failed' = 'failed';
  try {
    await sendEmail(owner);
    ownerStatus = 'sent';
  } catch (e) {
    const msg = `[email] ${label} owner notification failed (to ${owner.to}): ${
      (e as Error).message
    }`;
    console.error(msg);
    errors.push(msg);
  }

  return {
    buyer: buyerStatus,
    owner: ownerStatus,
    errors,
    at: new Date().toISOString(),
  };
}
