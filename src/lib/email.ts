// src/lib/email.ts
// Pure builders for the transactional emails. They produce { to, subject,
// html, replyTo } — no side effects, fully unit tested. Sending is done by
// src/lib/send-email.ts.

export const OWNER_EMAIL = 'guedesflavia@yahoo.com';

export type EmailContent = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

/** Lightweight email format check for the purchase forms. */
export function isValidEmail(email: string): boolean {
  const v = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export function usd(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const GOLD = '#C8A04B';

function shell(inner: string): string {
  return `<div style="background:#0A0A0A;padding:32px 0;font-family:Helvetica,Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:linear-gradient(180deg,#1E1E1E,#0A0A0A);border:1px solid rgba(200,160,75,0.35);border-radius:16px;padding:36px 32px;color:#EDEDED;text-align:center;">
    ${inner}
  </div>
</div>`;
}

// ---------------- Gift card — buyer ----------------

export type GiftCardEmailData = {
  buyerEmail?: string | null;
  name: string;
  giftName?: string | null;
  amountCents: number;
  message?: string | null;
  locale?: string;
};

export function buildGiftCardBuyerEmail(
  d: GiftCardEmailData
): EmailContent | null {
  if (!d.buyerEmail) return null;
  const pt = d.locale === 'pt';

  const subject = pt
    ? 'Seu Gift Card — Flavia Guedes 💛'
    : 'Your Gift Card — Flavia Guedes 💛';

  const inner = `
    <p style="font-size:13px;letter-spacing:3px;text-transform:uppercase;color:${GOLD};margin:0;">
      Flavia Guedes
    </p>
    <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(200,160,75,0.7);margin:6px 0 24px;">
      Gift Card
    </p>
    <p style="font-size:52px;font-weight:700;color:${GOLD};margin:0;">${usd(d.amountCents)}</p>
    ${
      d.message
        ? `<p style="font-style:italic;font-size:18px;color:#e5e5e5;margin:22px 0;">&ldquo;${d.message}&rdquo;</p>`
        : ''
    }
    <div style="height:1px;background:rgba(200,160,75,0.3);margin:24px 0;"></div>
    <p style="font-size:13px;color:#B0B0B0;margin:0;">
      ${pt ? 'De' : 'From'}: <strong style="color:#fff;">${d.name}</strong>
      ${d.giftName ? ` &nbsp;·&nbsp; ${pt ? 'Para' : 'To'}: <strong style="color:#fff;">${d.giftName}</strong>` : ''}
    </p>
    <p style="font-size:12px;color:${GOLD};margin-top:18px;">
      ${pt ? '✨ Para usar com a Flavia Guedes ✨' : '✨ To be used with Flavia Guedes ✨'}
    </p>
    <p style="font-size:12px;color:#777;margin-top:24px;">
      ${pt ? 'O cartão está em anexo — é só encaminhar para quem você quer presentear.' : 'Your card is attached — just forward it to whoever you are gifting.'}
    </p>`;

  return {
    to: d.buyerEmail,
    subject,
    html: shell(inner),
    replyTo: OWNER_EMAIL,
  };
}

// ---------------- Beauty Bank — buyer ----------------

export type BeautyBankEmailData = {
  buyerEmail?: string | null;
  name: string;
  depositCents: number;
  creditCents: number;
  locale?: string;
};

export function buildBeautyBankBuyerEmail(
  d: BeautyBankEmailData
): EmailContent | null {
  if (!d.buyerEmail) return null;
  const pt = d.locale === 'pt';

  const subject = pt
    ? 'Bem-vinda ao VIP Beauty Bank 💛'
    : 'Welcome to the VIP Beauty Bank 💛';

  const inner = `
    <p style="font-size:13px;letter-spacing:3px;text-transform:uppercase;color:${GOLD};margin:0;">
      Flavia Guedes
    </p>
    <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(200,160,75,0.7);margin:6px 0 24px;">
      VIP Beauty Bank
    </p>
    <p style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#B0B0B0;margin:0;">
      ${pt ? 'Seu crédito' : 'Your credit'}
    </p>
    <p style="font-size:52px;font-weight:700;color:${GOLD};margin:6px 0 0;">${usd(d.creditCents)}</p>
    <p style="font-size:13px;color:#B0B0B0;margin:10px 0 0;">
      ${pt ? 'Depósito' : 'Deposit'} ${usd(d.depositCents)} ·
      +${usd(d.creditCents - d.depositCents)} ${pt ? 'bônus' : 'bonus'}
    </p>
    <div style="height:1px;background:rgba(200,160,75,0.3);margin:24px 0;"></div>
    <p style="font-size:13px;color:#B0B0B0;margin:0;">
      ${pt ? 'Titular' : 'Account holder'}: <strong style="color:#fff;">${d.name}</strong>
    </p>
    <p style="font-size:12px;color:${GOLD};margin-top:14px;">
      ✦ ${pt ? 'Sem prazo de validade' : 'No expiration date'} ✦
    </p>`;

  return {
    to: d.buyerEmail,
    subject,
    html: shell(inner),
    replyTo: OWNER_EMAIL,
  };
}

// ---------------- Owner notifications ----------------

function ownerShell(rows: string): string {
  return `<div style="font-family:Helvetica,Arial,sans-serif;color:#1E1E1E;max-width:480px;margin:0 auto;">
    ${rows}
  </div>`;
}

export type OwnerGiftCardData = {
  name: string;
  giftName?: string | null;
  amountCents: number;
  buyerEmail?: string | null;
};

export function buildOwnerGiftCardNotification(
  d: OwnerGiftCardData
): EmailContent {
  return {
    to: OWNER_EMAIL,
    subject: `Nova venda de Gift Card — ${usd(d.amountCents)}`,
    html: ownerShell(`
      <h2>🎁 Novo Gift Card vendido</h2>
      <p><strong>Valor:</strong> ${usd(d.amountCents)}</p>
      <p><strong>Comprador:</strong> ${d.name}${d.buyerEmail ? ` (${d.buyerEmail})` : ''}</p>
      ${d.giftName ? `<p><strong>Para:</strong> ${d.giftName}</p>` : ''}
      <p style="color:#888;font-size:12px;">Veja os detalhes no painel: flaviaguedes.com/adm/dashboard</p>
    `),
  };
}

export type OwnerBeautyBankData = {
  name: string;
  depositCents: number;
  creditCents: number;
  buyerEmail?: string | null;
};

export function buildOwnerBeautyBankNotification(
  d: OwnerBeautyBankData
): EmailContent {
  return {
    to: OWNER_EMAIL,
    subject: `Nova venda VIP Beauty Bank — ${usd(d.creditCents)} de crédito`,
    html: ownerShell(`
      <h2>👑 Novo VIP Beauty Bank</h2>
      <p><strong>Depósito:</strong> ${usd(d.depositCents)}</p>
      <p><strong>Crédito:</strong> ${usd(d.creditCents)}</p>
      <p><strong>Cliente:</strong> ${d.name}${d.buyerEmail ? ` (${d.buyerEmail})` : ''}</p>
      <p style="color:#888;font-size:12px;">Veja o saldo no painel: flaviaguedes.com/adm/beauty-bank</p>
    `),
  };
}
