import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // protect admin dashboard
  if (pathname.startsWith('/dashboard/admin')) {
    const hasSession = req.cookies.get('sb-access-token')

    if (!hasSession) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/admin/:path*'],
}
