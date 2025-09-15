import { NextRequest, NextResponse } from 'next/server';
import { readGuests, writeGuests, Guest } from '@/lib/csv-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guests = await readGuests();
    const guest = guests.find(g => g.guest_id === id);
    
    if (!guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }
    
    return NextResponse.json({ guest });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read guest' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const guests = await readGuests();
    const guestIndex = guests.findIndex(g => g.guest_id === id);
    
    if (guestIndex === -1) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }
    
    guests[guestIndex] = { ...guests[guestIndex], ...body };
    await writeGuests(guests);
    
    return NextResponse.json({ guest: guests[guestIndex], status: 'updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update guest' }, { status: 500 });
  }
}
