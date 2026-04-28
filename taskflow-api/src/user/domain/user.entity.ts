export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

interface UserConstructorParams {
    id: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

export class User {
    readonly id: string;
    readonly email: string;
    readonly passwordHash: string;
    readonly role: UserRole;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    constructor({ id, email, passwordHash, role, createdAt, updatedAt }: UserConstructorParams) {
        if (!email || email.trim().length === 0) {
            throw new Error('Email cannot be empty');
        }
        this.id = id;
        this.email = email.trim().toLowerCase();
        this.passwordHash = passwordHash;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
