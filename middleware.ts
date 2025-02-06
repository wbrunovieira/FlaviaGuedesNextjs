// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'pt'];
const DEFAULT_LOCALE = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Se já estiver na rota de um locale, não redirecione
  if (
    SUPPORTED_LOCALES.some(locale =>
      pathname.startsWith(`/${locale}`)
    )
  ) {
    return NextResponse.next();
  }

  // Detecta o idioma via cabeçalho, se necessário
  const acceptLanguage =
    request.headers.get('accept-language') || '';
  console.log(
    'accept language do middleware',
    acceptLanguage
  );
  const locale = acceptLanguage.toLowerCase().includes('pt')
    ? 'pt'
    : DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${
    pathname === '/' ? '' : pathname
  }`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/'],
};
