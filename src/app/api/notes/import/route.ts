import { importNotes } from '@/lib/db';
import { isAdminRequest, sameOriginRequest } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!sameOriginRequest(request)) return Response.json({ error: 'Request rejected.' }, { status: 403 });
  if (!isAdminRequest(request)) return Response.json({ error: 'Admin login required.' }, { status: 401 });
  try {
    const body = await request.json();
    if (!Array.isArray(body.notes) || body.notes.length > 500) return Response.json({ error: 'Invalid notes list.' }, { status: 400 });
    const imported = await importNotes(body.notes);
    return Response.json({ imported });
  } catch {
    return Response.json({ error: 'Notes could not be imported.' }, { status: 400 });
  }
}
