
import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'admin-session';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const { pathname } = request.nextUrl;

  const isAuthenticated = () => {
    if (!sessionCookie) return false;
    try {
      const session = JSON.parse(sessionCookie.value);
      return session.isAuthenticated === true;
    } catch {
      return false;
    }
  };

  const authed = isAuthenticated();

  // If user is authenticated and tries to visit login page, redirect to dashboard
  if (authed && pathname.startsWith('/admin/login')) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // If user is not authenticated and tries to visit a protected admin route, redirect to login
  if (!authed && pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all admin routes including the root /admin page
  matcher: ['/admin', '/admin/:path*'],
};
