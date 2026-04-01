import { nestFetch } from '@/app/lib/nest';

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const res = await nestFetch(`/task/${id}`, { method: 'DELETE' });
    if (res.status === 204 || res.headers.get('content-length') === '0') {
        return new Response(null, { status: 204 });
    }
    const data = await res.json();
    return Response.json(data, { status: res.status });
}
