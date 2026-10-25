import { isAdminRequest } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  return Response.json({ authenticated: isAdminRequest(request) }, {
    headers: { 'Cache-Control': 'no-store' }
  });
}
