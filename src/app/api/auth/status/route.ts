import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const authCookie = request.cookies.get('voter_board_auth')

  return NextResponse.json({
    authenticated: authCookie?.value === 'authenticated',
    cookieValue: authCookie?.value || null,
    timestamp: new Date().toISOString()
  })
}
