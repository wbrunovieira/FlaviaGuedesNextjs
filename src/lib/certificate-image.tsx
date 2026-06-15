// src/lib/certificate-image.tsx
// Server-side PNG of the gift card / Beauty Bank certificate, rendered with
// next/og (Satori). This is the attachable, forwardable file. Satori only
// supports a subset of CSS (flexbox, inline styles) — keep it simple.
import { ImageResponse } from 'next/og';

const LOGO_URL =
  'https://flaviaguedes.com/images/flavia-logo-gold.png';
const GOLD = '#C8A04B';

const usd = (cents: number) =>
  `$${(cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

async function toPng(element: React.ReactElement): Promise<Buffer> {
  const res = new ImageResponse(element, {
    width: 1000,
    height: 600,
  });
  return Buffer.from(await res.arrayBuffer());
}

function frame(children: React.ReactNode) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(180deg, #1E1E1E 0%, #050505 60%, #1E1E1E 100%)',
        border: `4px solid ${GOLD}`,
        padding: 50,
        fontFamily: 'sans-serif',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_URL} width={300} height={104} alt="" />
      {children}
    </div>
  );
}

export async function renderGiftCardImage(d: {
  amountCents: number;
  name: string;
  giftName?: string | null;
  message?: string | null;
}): Promise<Buffer> {
  return toPng(
    frame(
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: 6,
            color: 'rgba(200,160,75,0.75)',
            marginTop: 18,
          }}
        >
          GIFT CARD
        </div>
        <div
          style={{
            fontSize: 100,
            fontWeight: 700,
            color: GOLD,
            marginTop: 14,
          }}
        >
          {usd(d.amountCents)}
        </div>
        {d.message ? (
          <div
            style={{
              fontSize: 26,
              fontStyle: 'italic',
              color: '#E5E5E5',
              marginTop: 18,
            }}
          >
            {`“${d.message}”`}
          </div>
        ) : null}
        <div
          style={{
            fontSize: 20,
            color: '#B0B0B0',
            marginTop: 22,
          }}
        >
          {d.giftName
            ? `${d.name}  →  ${d.giftName}`
            : d.name}
        </div>
      </div>
    )
  );
}

export async function renderBeautyBankImage(d: {
  creditCents: number;
  depositCents: number;
  name: string;
}): Promise<Buffer> {
  return toPng(
    frame(
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: 6,
            color: 'rgba(200,160,75,0.75)',
            marginTop: 18,
          }}
        >
          VIP BEAUTY BANK
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: GOLD,
            marginTop: 14,
          }}
        >
          {usd(d.creditCents)}
        </div>
        <div
          style={{
            fontSize: 22,
            color: '#B0B0B0',
            marginTop: 12,
          }}
        >
          {`Depósito ${usd(d.depositCents)}  ·  +${usd(
            d.creditCents - d.depositCents
          )} bônus`}
        </div>
        <div
          style={{
            fontSize: 20,
            color: '#B0B0B0',
            marginTop: 22,
          }}
        >
          {d.name}
        </div>
      </div>
    )
  );
}
