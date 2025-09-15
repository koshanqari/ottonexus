import { NextRequest, NextResponse } from 'next/server';
import { readGuests, writeGuests, generateId, Guest } from '@/lib/csv-utils';

export async function GET() {
  try {
    const guests = await readGuests();
    return NextResponse.json({ guests });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read guests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_id, name, email, phone, company_id } = body;
    
    const guests = await readGuests();
    const newGuest: Guest = {
      guest_id: generateId('gst'),
      event_id,
      name,
      email,
      phone,
      company_id,
      kyc_file: '',
      status: 'pending',
      rsvp: 'maybe'
    };
    
    guests.push(newGuest);
    await writeGuests(guests);
    
    return NextResponse.json({ guest: newGuest, status: 'registered' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create guest' }, { status: 500 });
  }
}
