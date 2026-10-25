import { deleteNote, updateNote } from '@/lib/db';
import { isAdminRequest, sameOriginRequest } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!sameOriginRequest(request)) return Response.json({ error: 'Request rejected.' }, { status: 403 });
  if (!isAdminRequest(request)) return Response.json({ error: 'Admin login required.' }, { status: 401 });
  try {
    const { id } = await context.params;
    const note = await updateNote(id, await request.json());
    return note
      ? Response.json(note, { headers: { 'Cache-Control': 'no-store' } })
      : Response.json({ error: 'Note not found.' }, { status: 404 });
  } catch {
    return Response.json({ error: 'The note could not be updated.' }, { status: 400 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!sameOriginRequest(request)) return Response.json({ error: 'Request rejected.' }, { status: 403 });
  if (!isAdminRequest(request)) return Response.json({ error: 'Admin login required.' }, { status: 401 });
  try {
    const { id } = await context.params;
    const deleted = await deleteNote(id);
    return deleted
      ? Response.json({ deleted: true }, { headers: { 'Cache-Control': 'no-store' } })
      : Response.json({ error: 'Note not found.' }, { status: 404 });
  } catch {
    return Response.json({ error: 'The note could not be deleted.' }, { status: 503 });
  }
}
