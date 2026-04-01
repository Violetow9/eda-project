import { nestFetch } from '@/app/lib/nest';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const body = await request.json();
    const res = await nestFetch(`/task/${id}/move`, {
        method: 'PATCH',
        body: JSON.stringify(body),
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
}
