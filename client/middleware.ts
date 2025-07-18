import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
  role: string;
  exp: number;
}

export function middleware(req: NextRequest) {
  console.log("✅ Middleware executing...");

  const { pathname } = req.nextUrl;
  const PUBLIC_PATHS = ['/_next', '/favicon.ico', '/api', '/.well-known'];

  // Allow public/static/API paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  // No token
  if (!token) {
    if (pathname === '/login' || pathname === '/register') {
      return NextResponse.next(); // unauthenticated user can visit login/register
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);

    // Expired token
    if (decoded.exp * 1000 < Date.now()) {
      console.log("⛔ Token expired");
      const res = NextResponse.redirect(new URL('/login', req.url));
      res.cookies.delete('token');
      return res;
    }

    // Authenticated users shouldn't access login/register again
    if (pathname === '/login' || pathname === '/register') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // 🛑 1. Admin trying to access non-admin dashboard
    if (pathname.startsWith('/dashboard') && decoded.role === 'admin') {
      console.log("⛔ Admin trying to access user dashboard");
      return NextResponse.redirect(new URL('/access-denied', req.url));
    }

    // 🛑 2. Non-admin trying to access admin area
    if (pathname.startsWith('/admin') && decoded.role !== 'admin') {
      console.log("⛔ Non-admin trying to access admin route");
      return NextResponse.redirect(new URL('/access-denied', req.url));
    }

    return NextResponse.next(); // All good

  } catch (err) {
    console.error("⛔ Invalid token:", err);
    const res = NextResponse.redirect(new URL('/login', req.url));
    res.cookies.delete('token');
    return res;
  }
}

export const config = {
  matcher: ['/', '/login', '/register', '/dashboard/:path*', '/admin/:path*'],
};
