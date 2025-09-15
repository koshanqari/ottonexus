import { NextRequest, NextResponse } from 'next/server';
import { readGuests, writeGuests } from '@/lib/csv-utils';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size too large. Maximum size is 5MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${id}_${Date.now()}_${file.name}`;
    const filePath = path.join(process.cwd(), 'uploads', fileName);

    await writeFile(filePath, buffer);

    // Update guest record with file path
    const guests = await readGuests();
    const guestIndex = guests.findIndex(g => g.guest_id === id);
    
    if (guestIndex === -1) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 });
    }

    guests[guestIndex].kyc_file = `/uploads/${fileName}`;
    guests[guestIndex].status = 'registered';
    
    await writeGuests(guests);

    return NextResponse.json({ 
      guest_id: id, 
      kyc_file: `/uploads/${fileName}`, 
      status: 'uploaded' 
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
