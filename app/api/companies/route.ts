import { NextRequest, NextResponse } from 'next/server';
import { readCompanies } from '@/lib/csv-utils';

export async function GET() {
  try {
    const companies = await readCompanies();
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
