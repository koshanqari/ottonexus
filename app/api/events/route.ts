import { NextRequest, NextResponse } from 'next/server';
import { readEvents, writeEvents, generateId, Event } from '@/lib/csv-utils';

export async function GET() {
  try {
    const events = await readEvents();
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read events' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { client_name, event_title, date, time, venue, description } = body;
    
    const events = await readEvents();
    const newEvent: Event = {
      event_id: generateId('evt'),
      client_name,
      event_title,
      date,
      time,
      venue,
      description
    };
    
    events.push(newEvent);
    await writeEvents(events);
    
    return NextResponse.json({ event: newEvent, status: 'created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
