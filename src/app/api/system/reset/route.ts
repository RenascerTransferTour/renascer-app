import { NextResponse } from 'next/server';
import { systemService } from '@/lib/db/services';

/**
 * API route to reset the mock database.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { level } = body;

        let result;
        if (level === 'full') {
            result = await systemService.resetAllData();
        } else if (level === 'operational') {
            result = await systemService.resetOperationalData();
        } else {
            return NextResponse.json({ error: 'Invalid reset level specified.' }, { status: 400 });
        }
        
        return NextResponse.json(result);

    } catch (error) {
        console.error("[API /system/reset] Unexpected error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected server error occurred.';
        
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
