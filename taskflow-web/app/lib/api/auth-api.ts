import { clearAccessToken, saveAccessToken } from '@/app/lib/auth-storage';
import { AuthUser, LoginInput, RegisterInput, TokenPair } from '@/app/types/auth';
import { authenticatedFetch } from './authenticated-fetch';

async function parseError(response: Response, fallback: string): Promise<Error> {
  const text = await response.text();

  try {
    const json = JSON.parse(text) as { message?: string | string[] };
    if (Array.isArray(json.message)) {
      return new Error(json.message.join(', '));
    }
    if (json.message) {
      return new Error(json.message);
    }
  } catch {
    // Body is not JSON.
  }

  return new Error(text || fallback);
}

export async function login(input: LoginInput): Promise<TokenPair> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await parseError(response, 'Erreur lors de la connexion');
  }

  const tokenPair = (await response.json()) as TokenPair;
  saveAccessToken(tokenPair.accessToken);
  return tokenPair;
}

export async function register(input: RegisterInput): Promise<TokenPair> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw await parseError(response, 'Erreur lors de l’inscription');
  }

  const tokenPair = (await response.json()) as TokenPair;
  saveAccessToken(tokenPair.accessToken);
  return tokenPair;
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  const response = await authenticatedFetch('/api/auth/me', {
    cache: 'no-store',
  });

  if (!response.ok) {
    clearAccessToken();
    throw await parseError(response, 'Utilisateur non authentifié');
  }

  return response.json();
}

export function logout(): void {
  clearAccessToken();
}
