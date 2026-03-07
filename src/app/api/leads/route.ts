import { NextResponse } from 'next/server';

/**
 * API route to list leads.
 */
export async function GET() {
  // Placeholder: In the future, this will call `leadService.listLeads()`
  const mockLeads = [
    { id: 'lead-1', contact_id: 'contact-1', status: 'new' },
    { id: 'lead-2', contact_id: 'contact-2', status: 'qualified' },
  ];
  return NextResponse.json(mockLeads);
}

/**
 * API route to create or update a lead.
 */
export async function POST(request: Request) {
    const body = await request.json();
    console.log('[Mock Lead API] Received data for create/update:', body);
    // Placeholder: In the future, this will call `leadService.createOrUpdateLead(body)`
    return NextResponse.json({ success: true, leadId: `lead_${Date.now()}`, ...body });
}
