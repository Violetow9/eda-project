const API_URL = process.env.API_INTERNAL_URL ?? process.env.API_URL ?? 'http://localhost:3000';

export async function nestFetch(
    path: string,
    init?: RequestInit,
): Promise<Response> {
    return fetch(`${API_URL}/v1${path}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...init?.headers,
        },
        cache: 'no-store',
    });
}
