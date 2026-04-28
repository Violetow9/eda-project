import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../domain/user.repository.interface';
import { TypeOrmUser } from './typeorm-user.entity';
import { User } from '../domain/user.entity';
import { toDomain, toTypeOrm } from './user.mapper';

@Injectable()
export class TypeormUserRepository implements UserRepository {
  constructor(
    @InjectRepository(TypeOrmUser)
    private readonly repo: Repository<TypeOrmUser>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.repo.findOne({
      where: { email: email.trim().toLowerCase() },
    });
    return row ? toDomain(row) : null;
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async findAll(): Promise<User[]> {
    const rows = await this.repo.find();
    return rows.map(toDomain);
  }

  async create(user: Partial<User>): Promise<User> {
    const entity = this.repo.create({
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
    });
    return toDomain(await this.repo.save(entity));
  }

  async update(user: User): Promise<User> {
    const row = await this.repo.save(toTypeOrm(user));
    return toDomain(row);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new Error(`User with id ${id} not found`);
    }
  }
}
