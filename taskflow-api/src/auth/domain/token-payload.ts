import { Role } from './authenticated-user.entity';

export interface AccessTokenPayload {
    sub: string;
    email: string;
    role: Role;
}
