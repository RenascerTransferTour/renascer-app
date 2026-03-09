import { NextResponse } from 'next/server';
import { dashboardService } from '@/lib/db/services';

// Esta flag é essencial para desabilitar o cache de dados e garantir 
// que o dashboard sempre busque as informações mais recentes.
export const dynamic = 'force-dynamic';

/**
 * API route para obter as estatísticas do dashboard.
 */
export async function GET() {
  try {
    const stats = await dashboardService.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('API Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
