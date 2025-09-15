import { NextRequest, NextResponse } from 'next/server';
import { readEvents, writeEvents, readGuests, writeGuests, Event } from '@/lib/csv-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const events = await readEvents();
    const event = events.find(e => e.event_id === id);
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    const guests = await readGuests();
    const eventGuests = guests.filter(g => g.event_id === id);
    
    return NextResponse.json({ event, guests: eventGuests });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read event' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const events = await readEvents();
    const eventIndex = events.findIndex(e => e.event_id === id);
    
    if (eventIndex === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    events[eventIndex] = { ...events[eventIndex], ...body };
    await writeEvents(events);
    
    return NextResponse.json({ event: events[eventIndex], status: 'updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const events = await readEvents();
    const filteredEvents = events.filter(e => e.event_id !== id);
    
    if (filteredEvents.length === events.length) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    await writeEvents(filteredEvents);
    
    // Also remove associated guests
    const guests = await readGuests();
    const filteredGuests = guests.filter(g => g.event_id !== id);
    await writeGuests(filteredGuests);
    
    return NextResponse.json({ event_id: id, status: 'deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
