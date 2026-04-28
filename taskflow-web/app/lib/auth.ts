import { cookies } from 'next/headers';

export const AUTH_COOKIE = 'taskflow_token';

export type AuthMe = {
  id: string;
  email: string;
  role: string;
};

const API_URL =
  process.env.API_INTERNAL_URL ?? process.env.API_URL ?? 'http://localhost:3000';

export async function readToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value ?? null;
}

export async function getMe(): Promise<AuthMe | null> {
  const token = await readToken();
  if (!token) return null;

  const res = await fetch(`${API_URL}/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) return null;
  return (await res.json()) as AuthMe;
}
