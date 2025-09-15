import { NextRequest, NextResponse } from 'next/server';
import { readCompanies, writeCompanies } from '@/lib/csv-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const companies = await readCompanies();
    const company = companies.find(c => c.company_id === id);
    
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    
    const companies = await readCompanies();
    const companyIndex = companies.findIndex(c => c.company_id === id);
    
    if (companyIndex === -1) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    companies[companyIndex] = { ...companies[companyIndex], ...updates };
    await writeCompanies(companies);

    return NextResponse.json(companies[companyIndex]);
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
