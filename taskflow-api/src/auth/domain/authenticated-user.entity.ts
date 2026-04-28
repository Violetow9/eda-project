export type Role = 'user' | 'admin';

export class AuthenticatedUser {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly role: Role,
  ) {}
}
