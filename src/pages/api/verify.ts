import type { APIRoute } from 'astro';

// POST /api/verify - Verify auth key
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const runtime = locals.runtime as any;

    if (!runtime || !runtime.env || !runtime.env.AUTH_KEY) {
      console.error('Runtime or AUTH_KEY not available. locals.runtime:', locals.runtime);
      return new Response(
        JSON.stringify({ error: 'Auth configuration failed - server misconfiguration' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Check authentication
    const authHeader = request.headers.get('Authorization');
    const expectedAuth = `Bearer ${runtime.env.AUTH_KEY}`;

    if (authHeader !== expectedAuth) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ valid: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error verifying auth:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
