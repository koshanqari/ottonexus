import { NextRequest, NextResponse } from 'next/server';
import { readGuests } from '@/lib/csv-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guests = await readGuests();
    const employees = guests.filter(g => g.company_id === id);
    
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
