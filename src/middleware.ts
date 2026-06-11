// src/middleware.ts
// Protects the admin dashboard and admin API routes with the
// signed session cookie issued by /api/adm-login.
// Scoped via `matcher` so public pages and i18n routing are untouched.
import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  verifySessionToken,
} from '@/lib/admin-auth';

export async function middleware(request: NextRequest) {
  // card.flaviaguedes.com serves the digital business card
  const host = request.headers.get('host') ?? '';
  if (host.startsWith('card.')) {
    if (request.nextUrl.pathname === '/') {
      return NextResponse.rewrite(
        new URL('/card', request.url)
      );
    }
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === '/') {
    return NextResponse.next();
  }

  const token = request.cookies.get(
    ADMIN_SESSION_COOKIE
  )?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;

  const isAuthenticated = secret
    ? await verifySessionToken(token, secret)
    : false;

  if (isAuthenticated) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return NextResponse.redirect(
    new URL('/adm', request.url)
  );
}

export const config = {
  matcher: [
    '/',
    '/adm/dashboard/:path*',
    '/api/adm-get-giftcards',
    '/api/adm-delete-giftcard',
  ],
};
