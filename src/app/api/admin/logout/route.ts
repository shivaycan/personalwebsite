import { clearSessionCookie, sameOriginRequest } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!sameOriginRequest(request)) return Response.json({ error: 'Request rejected.' }, { status: 403 });
  return Response.json({ authenticated: false }, {
    headers: { 'Set-Cookie': clearSessionCookie(), 'Cache-Control': 'no-store' }
  });
}
