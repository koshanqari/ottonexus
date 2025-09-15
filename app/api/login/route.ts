import { NextRequest, NextResponse } from 'next/server';
import { readGuests, readEvents } from '@/lib/csv-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;
    
    const guests = await readGuests();
    const guest = guests.find(g => g.email === username);
    
    if (!guest) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const events = await readEvents();
    const event = events.find(e => e.event_id === guest.event_id);
    
    return NextResponse.json({ 
      guest_id: guest.guest_id, 
      event_id: guest.event_id, 
      name: guest.name,
      event: event
    });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
