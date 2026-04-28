import { nestFetch } from '@/app/lib/nest';
import { getForwardedAuthHeaders } from '@/app/lib/server-auth';

export async function GET(request: Request) {
  const res = await nestFetch('/project', {
    headers: getForwardedAuthHeaders(request),
  });

  const text = await res.text();

  return new Response(text, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('content-type') ?? 'application/json',
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const res = await nestFetch('/project', {
    method: 'POST',
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
