import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../domain/authenticated-user.entity';
import { ROLES_KEY } from '../presentation/decorators/roles.decorator';
import { AuthenticatedUser } from '../domain/authenticated-user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(ctx: ExecutionContext): boolean {
        const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);

        if (!required || required.length === 0) return true;

        const request = ctx.switchToHttp().getRequest();
        const user: AuthenticatedUser | undefined = request.user;

        return !!user && required.includes(user.role);
    }
}
