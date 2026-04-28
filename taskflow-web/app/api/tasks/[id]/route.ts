import { nestFetch } from '@/app/lib/nest';
import { getForwardedAuthHeaders } from '@/app/lib/server-auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const res = await nestFetch(`/task/${id}`, {
    method: 'DELETE',
    headers: getForwardedAuthHeaders(request),
  });

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return new Response(null, { status: 204 });
  }

  const text = await res.text();

  return new Response(text, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('content-type') ?? 'application/json',
    },
  });
}
