import { nestFetch } from '@/app/lib/nest';

export async function GET() {
    const res = await nestFetch('/project');
    const data = await res.json();
    return Response.json(data, { status: res.status });
}

export async function POST(request: Request) {
    const body = await request.json();
    const res = await nestFetch('/project', {
        method: 'POST',
        body: JSON.stringify(body),
    });
    const data = await res.json();
    return Response.json(data, { status: res.status });
}
