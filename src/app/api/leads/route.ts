import { NextResponse } from 'next/server';
import { leadService } from '@/lib/db/services';

/**
 * API route to list leads.
 */
export async function GET() {
  const leads = await leadService.listLeads();
  return NextResponse.json(leads);
}

/**
 * API route to create or update a lead.
 */
export async function POST(request: Request) {
    const body = await request.json();
    const updatedLead = await leadService.createOrUpdateLead(body);
    return NextResponse.json(updatedLead);
}
