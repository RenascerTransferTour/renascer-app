import { NextResponse } from 'next/server';
import { settingsService } from '@/lib/db/services';
import type { AiFlowPermission } from '@/lib/db/data-model';

/**
 * API route to list AI flow permissions.
 */
export async function GET() {
  try {
    const permissions = await settingsService.listPermissions();
    return NextResponse.json(permissions);
  } catch (error) {
    console.error('API Error fetching permissions:', error);
    return NextResponse.json({ error: 'Failed to fetch permissions' }, { status: 500 });
  }
}

/**
 * API route to update AI flow permissions.
 */
export async function POST(request: Request) {
    try {
      const body = await request.json();
      const updatedPermissions = await settingsService.updatePermissions(body as AiFlowPermission[]);
      return NextResponse.json({ success: true, permissions: updatedPermissions });
    } catch (error) {
       console.error('API Error updating permissions:', error);
       return NextResponse.json({ error: 'Failed to save permissions' }, { status: 500 });
    }
}
