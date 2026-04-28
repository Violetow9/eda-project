import {TypeOrmUser} from './typeorm-user.entity';
import {User} from '../domain/user.entity';

export function toDomain(row: TypeOrmUser): User {
    return new User({
        id: row.id,
        email: row.email,
        passwordHash: row.passwordHash,
        role: row.role,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    });
}

export function toTypeOrm(user: User): TypeOrmUser {
    const entity = new TypeOrmUser();
    entity.id = user.id;
    entity.email = user.email;
    entity.passwordHash = user.passwordHash;
    entity.role = user.role;
    return entity;
}
