import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const CORRECT_PASSWORD = process.env.BOARD_PASSWORD || "hackreation2025";
const AUTH_COOKIE_NAME = 'voter_board_auth';
const AUTH_COOKIE_VALUE = 'authenticated';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    if (password === CORRECT_PASSWORD) {
      const response = NextResponse.json(
        { success: true, message: 'Authentication successful' },
        { status: 200 }
      )

      // Set HTTP-only cookie for security
      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: AUTH_COOKIE_VALUE,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return response
    } else {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
