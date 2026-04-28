import {UserRole} from '../domain/user.entity';

export interface CreateUserCommand {
    readonly email: string;
    readonly password: string;
    readonly role: UserRole;
}
