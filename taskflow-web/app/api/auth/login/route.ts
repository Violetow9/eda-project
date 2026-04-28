import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from '@/app/lib/auth';

const API_URL =
  process.env.API_INTERNAL_URL ?? process.env.API_URL ?? 'http://localhost:3000';

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };

  const upstream = await fetch(`${API_URL}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: body.email, password: body.password }),
    cache: 'no-store',
  });

  const data = (await upstream.json()) as
    | { accessToken: string }
    | { message: string };

  if (!upstream.ok || !('accessToken' in data)) {
    return NextResponse.json(data, { status: upstream.status });
  }

  const store = await cookies();
  store.set(AUTH_COOKIE, data.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });

  return NextResponse.json({ ok: true });
}
