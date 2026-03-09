import { NextResponse } from 'next/server';
import { leadService } from '@/lib/db/services';

// Força a rota a ser dinâmica, desabilitando o cache.
// Essencial para que os dados sejam atualizados após um reset do sistema.
export const dynamic = 'force-dynamic';

/**
 * API route to list leads.
 */
export async function GET() {
  try {
    const leads = await leadService.listLeads();
    return NextResponse.json(leads);
  } catch (error) {
    console.error('API Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

/**
 * API route to create or update a lead.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updatedLead = await leadService.createOrUpdateLead(body);
    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error('API Error creating/updating lead:', error);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}
