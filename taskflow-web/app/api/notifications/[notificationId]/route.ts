import { nestFetch } from '@/app/lib/nest';
import { NextResponse } from 'next/server';

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ notificationId: string }> },
) {
  const { notificationId } = await context.params;

  const response = await nestFetch(`/notifications/${notificationId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const text = await response.text();

    return new NextResponse(text || 'Failed to delete notification', {
      status: response.status,
    });
  }

  return new NextResponse(null, {
    status: response.status,
  });
}