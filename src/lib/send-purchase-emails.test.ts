import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from 'vitest';

// Mock the thin Resend wrapper so no real email is sent.
const sendEmail = vi.fn();
vi.mock('./send-email', () => ({
  sendEmail: (...args: unknown[]) => sendEmail(...args),
}));

import { sendPurchaseEmails } from './send-purchase-emails';
import type { EmailContent } from './email';

const buyer: EmailContent = {
  to: 'buyer@example.com',
  subject: 'Your gift card',
  html: '<p>hi</p>',
  replyTo: 'owner@example.com',
};
const owner: EmailContent = {
  to: 'owner@example.com',
  subject: 'New gift card',
  html: '<p>sale</p>',
};
const png = () => Promise.resolve(Buffer.from('PNG'));
const attachment = { filename: 'gift-card.png', render: png };

beforeEach(() => {
  sendEmail.mockReset();
  sendEmail.mockResolvedValue(undefined);
});

describe('sendPurchaseEmails', () => {
  it('sends buyer (with attachment) and owner on the happy path', async () => {
    const res = await sendPurchaseEmails({
      label: 'gift card',
      buyer,
      owner,
      attachment,
    });

    expect(res.buyer).toBe('sent');
    expect(res.owner).toBe('sent');
    expect(res.errors).toEqual([]);
    expect(sendEmail).toHaveBeenCalledTimes(2);
    // buyer call carries the attachment
    expect(sendEmail).toHaveBeenNthCalledWith(1, buyer, [
      { filename: 'gift-card.png', content: expect.any(Buffer) },
    ]);
  });

  it('falls back to sending the buyer email WITHOUT the attachment when the PNG render fails', async () => {
    const res = await sendPurchaseEmails({
      label: 'gift card',
      buyer,
      owner,
      attachment: {
        filename: 'gift-card.png',
        render: () => Promise.reject(new Error('satori boom')),
      },
    });

    expect(res.buyer).toBe('sent_without_attachment');
    expect(res.owner).toBe('sent');
    expect(res.errors).toHaveLength(1);
    expect(res.errors[0]).toContain('satori boom');
    // buyer still sent, but without attachments
    expect(sendEmail).toHaveBeenNthCalledWith(1, buyer, undefined);
    // owner still notified
    expect(sendEmail).toHaveBeenCalledTimes(2);
  });

  it('still sends the owner notification when the buyer email fails', async () => {
    sendEmail
      .mockRejectedValueOnce(new Error('buyer bounce'))
      .mockResolvedValueOnce(undefined);

    const res = await sendPurchaseEmails({
      label: 'gift card',
      buyer,
      owner,
      attachment,
    });

    expect(res.buyer).toBe('failed');
    expect(res.owner).toBe('sent');
    expect(res.errors[0]).toContain('buyer bounce');
  });

  it('reports owner failure independently', async () => {
    sendEmail
      .mockResolvedValueOnce(undefined) // buyer ok
      .mockRejectedValueOnce(new Error('owner bounce'));

    const res = await sendPurchaseEmails({
      label: 'gift card',
      buyer,
      owner,
      attachment,
    });

    expect(res.buyer).toBe('sent');
    expect(res.owner).toBe('failed');
    expect(res.errors[0]).toContain('owner bounce');
  });

  it('skips the buyer email (and the render) when there is no buyer', async () => {
    const render = vi.fn(png);
    const res = await sendPurchaseEmails({
      label: 'gift card',
      buyer: null,
      owner,
      attachment: { filename: 'gift-card.png', render },
    });

    expect(res.buyer).toBe('skipped');
    expect(res.owner).toBe('sent');
    expect(render).not.toHaveBeenCalled();
    // only the owner notification is sent
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith(owner);
  });
});
