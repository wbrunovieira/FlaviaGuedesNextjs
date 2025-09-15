import { NextResponse } from 'next/server';

export async function GET() {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';

  return NextResponse.json({
    environment: isProduction ? 'Production' : 'Sandbox',
    hasProductionToken: !!process.env.SQUARE_ACCESS_TOKEN,
    hasSandboxToken: !!process.env.SQUARE_SANDBOX_ACCESS_TOKEN,
    hasProductionAppId: !!process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
    hasSandboxAppId: !!process.env.NEXT_PUBLIC_SQUARE_SANDBOX_APPLICATION_ID,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV
  });
}