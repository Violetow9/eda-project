import { nestFetch } from '@/app/lib/nest';

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ projectId: string }> },
) {
    const { projectId } = await params;
    const res = await nestFetch(`/task/project/${projectId}`);
    const data = await res.json();
    return Response.json(data, { status: res.status });
}
