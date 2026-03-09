import { NextResponse } from 'next/server';
import { crmService } from '@/lib/db/services';

// Força a rota a ser dinâmica, desabilitando o cache.
// Essencial para que os dados sejam atualizados após um reset do sistema.
export const dynamic = 'force-dynamic';

/**
 * API route to list CRM deals.
 */
export async function GET() {
  try {
    const deals = await crmService.listDeals();
    return NextResponse.json(deals);
  } catch (error) {
    console.error('API Error fetching deals:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}

/**
 * API route to create or update a CRM deal.
 */
export async function POST(request: Request) {
    try {
      const body = await request.json();
      // In a real app, you'd have validation here (e.g., with Zod)
      const updatedDeal = await crmService.createOrUpdateDeal(body);
      return NextResponse.json(updatedDeal);
    } catch (error) {
       console.error('API Error creating/updating deal:', error);
       return NextResponse.json({ error: 'Failed to save deal' }, { status: 500 });
    }
}
