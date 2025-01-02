import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === '/login') return NextResponse.next();

  const token = req.cookies.get('JSESSIONID');

  if (!token) {
    return NextResponse.rewrite(new URL('/login', req.nextUrl).toString());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
