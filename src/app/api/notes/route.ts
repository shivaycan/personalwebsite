import { createNote, listNotes } from '@/lib/db';
import { sameOriginRequest } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return Response.json(await listNotes(), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Notes database is not connected yet.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!sameOriginRequest(request)) return Response.json({ error: 'Request rejected.' }, { status: 403 });
  const length = Number(request.headers.get('content-length') ?? 0);
  if (length > 120_000) return Response.json({ error: 'This note is too large.' }, { status: 413 });
  try {
    const input = await request.json();
    return Response.json(await createNote(input), { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const message = error instanceof Error && /title and note body/.test(error.message)
      ? error.message
      : 'The note could not be saved. Check the database connection.';
    return Response.json({ error: message }, { status: 400 });
  }
}
