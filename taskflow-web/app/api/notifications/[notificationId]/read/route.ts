import { nestFetch } from '@/app/lib/nest';

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ notificationId: string }> },
) {
  const { notificationId } = await params;
  const response = await nestFetch(`/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
  const data = await response.json();
  return Response.json(data, { status: response.status });
}
