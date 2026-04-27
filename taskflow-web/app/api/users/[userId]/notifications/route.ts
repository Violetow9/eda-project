import { nestFetch } from '@/app/lib/nest';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  const response = await nestFetch(`/notifications/${userId}`);
  const data = await response.json();
  return Response.json(data, { status: response.status });
}
