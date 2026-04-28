import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { TokenProvider } from '../domain/token-provider.interface';
import { TOKEN_PROVIDER } from '../application/auth.constants';
import { AuthenticatedUser } from '../domain/authenticated-user.entity';
import { IS_PUBLIC_KEY } from '../presentation/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_PROVIDER)
    private readonly tokenProvider: TokenProvider,
    private readonly reflector: Reflector,
  ) {}

  canActivate(ctx: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const request = ctx.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    const payload = this.tokenProvider.verifyAccess(token);
    request['user'] = new AuthenticatedUser(
      payload.sub,
      payload.email,
      payload.role,
    );

    return true;
  }

  private extractToken(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? (token ?? null) : null;
  }
}
