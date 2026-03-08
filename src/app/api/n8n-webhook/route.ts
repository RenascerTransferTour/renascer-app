import { NextRequest, NextResponse } from 'next/server';

/**
 * A secure webhook endpoint for n8n workflows.
 * It authenticates requests using a bearer token stored in environment variables.
 */
export async function POST(request: NextRequest) {
  const authToken = request.headers.get('Authorization');
  const n8nSecret = process.env.N8N_SECRET_TOKEN;

  // 1. Validate that the secret token is configured on the server.
  if (!n8nSecret) {
    console.error('[n8n Webhook] Error: N8N_SECRET_TOKEN is not set on the server.');
    // Do not expose the exact reason to the client for security.
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  // 2. Validate the Authorization header format.
  if (!authToken || !authToken.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized: Missing or invalid token format.' }, { status: 401 });
  }

  const token = authToken.split(' ')[1];

  // 3. Compare the provided token with the server's secret token.
  if (token !== n8nSecret) {
    return NextResponse.json({ error: 'Forbidden: Invalid token.' }, { status: 403 });
  }

  try {
    const payload = await request.json();

    // At this point, the request is authenticated.
    // You can now process the payload from your n8n workflow.
    console.log('[n8n Webhook] Received and authenticated payload:', payload);

    // Example: Trigger other services, update database, etc.
    // await someOtherService.processN8nData(payload);

    // Respond to n8n to confirm receipt.
    return NextResponse.json({ status: 'success', message: 'Payload received and processed.' });
  } catch (error) {
    console.error('[n8n Webhook] Error processing JSON payload:', error);
    return NextResponse.json({ error: 'Bad Request: Invalid JSON payload.' }, { status: 400 });
  }
}
