import { NextResponse } from 'next/server';
import { settingsService } from '@/lib/db/services';

/**
 * API route to publish the current draft prompt.
 */
export async function POST() {
    try {
        const result = await settingsService.publishDraftPrompt();
        if (!result) {
            return NextResponse.json({ success: false, error: 'No draft prompt found to publish.' }, { status: 400 });
        }
        return NextResponse.json({ success: true, ...result });
    } catch (error) {
        console.error('[API POST /api/settings/prompts/publish] Error:', error);
        return NextResponse.json({ error: 'Failed to publish prompt' }, { status: 500 });
    }
}
