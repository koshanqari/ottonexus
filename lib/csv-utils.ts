import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';

const dataDir = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export interface Event {
  event_id: string;
  client_name: string;
  event_title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
}

export interface Guest {
  guest_id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string;
  company_id: string;
  kyc_file: string;
  status: string;
  rsvp: string;
}

export interface Company {
  company_id: string;
  company_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  settings: string;
  created_at: string;
}

export async function readEvents(): Promise<Event[]> {
  return new Promise((resolve, reject) => {
    const events: Event[] = [];
    const filePath = path.join(dataDir, 'events.csv');
    
    if (!fs.existsSync(filePath)) {
      resolve([]);
      return;
    }
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => events.push(data))
      .on('end', () => resolve(events))
      .on('error', (error) => {
        console.error('Error reading events.csv:', error);
        reject(error);
      });
  });
}

export async function readGuests(): Promise<Guest[]> {
  return new Promise((resolve, reject) => {
    const guests: Guest[] = [];
    const filePath = path.join(dataDir, 'guests.csv');
    
    if (!fs.existsSync(filePath)) {
      resolve([]);
      return;
    }
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => guests.push(data))
      .on('end', () => resolve(guests))
      .on('error', (error) => {
        console.error('Error reading guests.csv:', error);
        reject(error);
      });
  });
}

export async function writeEvents(events: Event[]): Promise<void> {
  try {
    const csvWriter = createObjectCsvWriter({
      path: path.join(dataDir, 'events.csv'),
      header: [
        { id: 'event_id', title: 'event_id' },
        { id: 'client_name', title: 'client_name' },
        { id: 'event_title', title: 'event_title' },
        { id: 'date', title: 'date' },
        { id: 'time', title: 'time' },
        { id: 'venue', title: 'venue' },
        { id: 'description', title: 'description' }
      ]
    });
    
    await csvWriter.writeRecords(events);
  } catch (error) {
    console.error('Error writing events.csv:', error);
    throw error;
  }
}

export async function writeGuests(guests: Guest[]): Promise<void> {
  try {
    const csvWriter = createObjectCsvWriter({
      path: path.join(dataDir, 'guests.csv'),
      header: [
        { id: 'guest_id', title: 'guest_id' },
        { id: 'event_id', title: 'event_id' },
        { id: 'name', title: 'name' },
        { id: 'email', title: 'email' },
        { id: 'phone', title: 'phone' },
        { id: 'company_id', title: 'company_id' },
        { id: 'kyc_file', title: 'kyc_file' },
        { id: 'status', title: 'status' },
        { id: 'rsvp', title: 'rsvp' }
      ]
    });
    
    await csvWriter.writeRecords(guests);
  } catch (error) {
    console.error('Error writing guests.csv:', error);
    throw error;
  }
}

export async function readCompanies(): Promise<Company[]> {
  return new Promise((resolve, reject) => {
    const companies: Company[] = [];
    const filePath = path.join(dataDir, 'companies.csv');
    
    if (!fs.existsSync(filePath)) {
      resolve([]);
      return;
    }
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => companies.push(data))
      .on('end', () => resolve(companies))
      .on('error', (error) => {
        console.error('Error reading companies.csv:', error);
        reject(error);
      });
  });
}

export async function writeCompanies(companies: Company[]): Promise<void> {
  try {
    const csvWriter = createObjectCsvWriter({
      path: path.join(dataDir, 'companies.csv'),
      header: [
        { id: 'company_id', title: 'company_id' },
        { id: 'company_name', title: 'company_name' },
        { id: 'contact_email', title: 'contact_email' },
        { id: 'contact_phone', title: 'contact_phone' },
        { id: 'address', title: 'address' },
        { id: 'settings', title: 'settings' },
        { id: 'created_at', title: 'created_at' }
      ]
    });
    
    await csvWriter.writeRecords(companies);
  } catch (error) {
    console.error('Error writing companies.csv:', error);
    throw error;
  }
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
