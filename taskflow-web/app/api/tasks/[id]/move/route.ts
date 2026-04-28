import { nestFetch } from '@/app/lib/nest';
import { getForwardedAuthHeaders } from '@/app/lib/server-auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  const res = await nestFetch(`/task/${id}/move`, {
    method: 'PATCH',
    headers: getForwardedAuthHeaders(request),
    body: JSON.stringify(body),
  });

  const text = await res.text();

  return new Response(text, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('content-type') ?? 'application/json',
    },
  });
}
