import { checkCredentials, makeSessionCookie, sameOriginRequest } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!sameOriginRequest(request)) return Response.json({ error: 'Request rejected.' }, { status: 403 });
  let input: { username?: unknown; password?: unknown };
  try { input = await request.json(); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  try {
    if (!checkCredentials(input.username, input.password)) {
      return Response.json({ error: 'Those credentials did not match.' }, { status: 401 });
    }
    return Response.json({ authenticated: true }, {
      headers: { 'Set-Cookie': makeSessionCookie(), 'Cache-Control': 'no-store' }
    });
  } catch {
    return Response.json({ error: 'Admin login is not configured yet.' }, { status: 503 });
  }
}
