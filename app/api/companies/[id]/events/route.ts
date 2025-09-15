import { NextRequest, NextResponse } from 'next/server';
import { readEvents, readGuests, readCompanies } from '@/lib/csv-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [events, guests, companies] = await Promise.all([readEvents(), readGuests(), readCompanies()]);
    
    // Get company details to find company name
    const company = companies.find(c => c.company_id === id);
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }
    
    // Get events organized by this company (filter by client_name)
    const companyEvents = events.filter(e => e.client_name === company.company_name);
    
    // Add participation stats to each event
    const eventsWithStats = companyEvents.map(event => {
      const eventGuests = guests.filter(g => g.event_id === event.event_id && g.company_id === id);
      const rsvpStats = {
        yes: eventGuests.filter(g => g.rsvp === 'yes').length,
        no: eventGuests.filter(g => g.rsvp === 'no').length,
        maybe: eventGuests.filter(g => g.rsvp === 'maybe' || !g.rsvp).length,
        total: eventGuests.length
      };
      
      return {
        ...event,
        participation: rsvpStats
      };
    });
    
    return NextResponse.json(eventsWithStats);
  } catch (error) {
    console.error('Error fetching company events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
