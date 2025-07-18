// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode from jwt-decode

// Interface for your decoded token payload (adjust if your token has different fields)
interface DecodedToken {
  id: string;
  role: string;
  exp: number; // Expiration time (timestamp)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  let decoded: DecodedToken | null = null;
  let role: string | null = null;

  if (token) {
    try {
      decoded = jwtDecode<DecodedToken>(token);
      console.log(decoded)
      role = decoded.role;

      // Optional: Check token expiration. If expired, treat as not authenticated.
      const currentTime = Date.now() / 1000; // current time in seconds
      if (decoded.exp < currentTime) {
        console.log("[Middleware] Token expired. Treating as unauthenticated.");
        decoded = null; // Invalidate decoded token
        role = null;
      }

    } catch (err: any) {
      console.error("[Middleware] Failed to decode token:", err.message);
      decoded = null; // Treat as unauthenticated if decode fails
      role = null;
    }
  }

  // Paths that are publicly accessible (login, register, home)
  const publicPaths = ['/login', '/register', '/'];

  // All dashboard routes (including sub-dashboards) and other auth-required paths
  const protectedAuthPaths = [
    '/dashboard',
    '/dashboard/general',
    '/admin/dashboard',
    '/dashboard/ot',
    '/dashboard/pharmacy',
    '/profile', // Example of another authenticated path
    // Add any other paths that generally require a user to be logged in
  ];

  console.log(`[Middleware] Processing path: ${pathname}, Token present: ${!!token}, Role: ${role || 'N/A'}`);


  if (decoded) {
    // If an authenticated user tries to access public paths (/login, /register, /)
    if (publicPaths.includes(pathname)) {
      let redirectPath = '/dashboard/general'; // Default fallback dashboard

      // Determine specific dashboard based on role
      if (role === 'admin') redirectPath = '/admin/dashboard';
      else if (role === 'ot_staff') redirectPath = '/dashboard/ot';
      else if (role === 'pharmacy_staff') redirectPath = '/dashboard/pharmacy';
      // 'general_staff' is already the default if no specific match

      console.log(`[Middleware] Authenticated user (${role || 'N/A'}) trying to access public path '${pathname}'. Redirecting to: ${redirectPath}`);
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // 2. Role-based Authorization for specific dashboards/routes
    // This block only runs if `decoded` is true (i.e., user is authenticated)
    const isProtectedDashboardRoute = protectedAuthPaths.some(path => pathname.startsWith(path));

    if (isProtectedDashboardRoute) {
      let isAuthorizedForPath = false;

      // Check for exact match for specific dashboard roles based on the requested path
      if (role === 'admin' && pathname.startsWith('/admin/dashboard')) {
        isAuthorizedForPath = true;
      } else if (role === 'ot_staff' && pathname.startsWith('/dashboard/ot')) {
        isAuthorizedForPath = true;
      } else if (role === 'pharmacy_staff' && pathname.startsWith('/dashboard/pharmacy')) {
        isAuthorizedForPath = true;
      } else if (role === 'general_staff' && pathname.startsWith('/dashboard/general')) {
        isAuthorizedForPath = true;
      }

      // Allow any authenticated user to access the base '/dashboard'
      // This allows them to land on a general dashboard, which then might redirect them.
      if (pathname === '/dashboard') { // The base /dashboard path
        isAuthorizedForPath = true;
      }


      // If user is authenticated but not authorized for the specific dashboard path
      if (!isAuthorizedForPath) {
        console.log(`[Middleware] Auth user (${role || 'N/A'}) NOT authorized for specific path '${pathname}'. Redirecting to /access-denied.`);
        return NextResponse.redirect(new URL('/access-denied', request.url));
      }
    }

    // If we reach here, the user is authenticated, and the path is either allowed or not explicitly restricted by role.
    console.log(`[Middleware] Authenticated user (${role || 'N/A'}) allowed access to ${pathname}.`);
    return NextResponse.next();

  } else { // 3. If user is NOT authenticated (no token, or token invalid/expired)
    // If an unauthenticated user tries to access any protected path
    const requiresAuth = protectedAuthPaths.some(path => pathname.startsWith(path));

    if (requiresAuth) {
      console.log(`[Middleware] Unauthenticated user trying to access protected path '${pathname}'. Redirecting to /login.`);
      // Always redirect unauthenticated users to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 4. If no other conditions met (e.g., public path for unauthenticated users, or a static asset)
  console.log(`[Middleware] Allowing unauthenticated access to public path: ${pathname}`);
  return NextResponse.next();
}

export const config = {
  // Apply middleware to all paths except:
  // - API routes (/api/*)
  // - Next.js internal files (_next/*)
  // - Files with extensions (e.g., .png, .jpg, .ico, etc. - typically static assets)
  matcher: [
    '/((?!api|_next|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico|js|css)).*)',
  ],
};