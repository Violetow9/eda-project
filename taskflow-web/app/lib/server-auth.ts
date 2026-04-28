export function getForwardedAuthHeaders(request: Request): HeadersInit {
  const authorization = request.headers.get('authorization');
  return authorization ? { Authorization: authorization } : {};
}
