import { NextRequest, NextResponse } from 'next/server';
import { readCompanies } from '@/lib/csv-utils';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const companies = await readCompanies();
    const company = companies.find(c => 
      c.contact_email.toLowerCase() === email.toLowerCase()
    );
    
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      company_id: company.company_id,
      company_name: company.company_name,
      message: 'Login successful' 
    });
  } catch (error) {
    console.error('Corporate login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
