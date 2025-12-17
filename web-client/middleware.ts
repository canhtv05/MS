import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get('MY_MICROSERVICE');
  let accessToken = null;

  if (cookie) {
    try {
      const value = JSON.parse(cookie.value);
      accessToken = value.accessToken;
    } catch {
      // Cookie invalid or not JSON
    }
  }

  const { pathname } = request.nextUrl;
  const authRoutes = ['/sign-in', '/sign-up'];

  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (accessToken) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  /* customize
  const protectedRoutes = ['/home', '/profile'];
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }
  */

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, svgs, etc if any)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
