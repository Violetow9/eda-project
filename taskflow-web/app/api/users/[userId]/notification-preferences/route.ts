import { nestFetch } from '@/app/lib/nest';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  const { userId } = await context.params;

  const response = await nestFetch(`/notification-preferences/${userId}`, {
    method: 'GET',
  });

  const text = await response.text();

  if (!response.ok) {
    return new NextResponse(text || 'Failed to fetch notification preferences', {
      status: response.status,
    });
  }

  return new NextResponse(text, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ userId: string }> },
) {
  const { userId } = await context.params;
  const body = await request.json();

  const response = await nestFetch(`/notification-preferences/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  const text = await response.text();

  if (!response.ok) {
    return new NextResponse(text || 'Failed to update notification preferences', {
      status: response.status,
    });
  }

  return new NextResponse(text, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}