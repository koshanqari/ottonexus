import { NextRequest, NextResponse } from 'next/server';

// Simple organizer credentials - in production, this would be in a database
const ORGANIZER_CREDENTIALS = {
  email: 'admin@goldenlotus.com',
  password: 'organizer123'
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check credentials
    if (email === ORGANIZER_CREDENTIALS.email && password === ORGANIZER_CREDENTIALS.password) {
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        organizer: {
          email: email,
          name: 'Golden Lotus Admin'
        }
      });
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Organizer login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
