import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if maintenance mode is enabled
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true'

  if (maintenanceMode) {
    // Allow access to the maintenance page itself and static assets
    if (pathname === '/maintenance' ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/)) {
      return NextResponse.next()
    }

    // Redirect all other requests to maintenance page
    const maintenanceUrl = new URL('/maintenance', request.url)
    return NextResponse.redirect(maintenanceUrl)
  }

  // Normal authentication logic when not in maintenance mode
  const authCookie = request.cookies.get('voter_board_auth')

  // Allow access to the login page and API routes
  if (pathname === '/login' || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // If not authenticated and trying to access protected routes, redirect to login
  if (!authCookie || authCookie.value !== 'authenticated') {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If authenticated or accessing public routes, continue
  return NextResponse.next()
}

export const config = {
  // Protect all routes except static files and auth routes
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
