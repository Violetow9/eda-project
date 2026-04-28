import { readToken } from './auth';

const API_URL =
  process.env.API_INTERNAL_URL ?? process.env.API_URL ?? 'http://localhost:3000';

export async function nestFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const token = await readToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${API_URL}/v1${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });
}
