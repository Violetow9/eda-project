import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY } from './user.constants';
import { EVENT_PUBLISHER } from '../../event/application/event.constants';
import type { UserRepository } from '../domain/user.repository.interface';
import type { EventPublisher } from '../../event/application/event-publisher.interface';
import { User, UserRole } from '../domain/user.entity';
import { UserRegisteredEvent } from '../domain/user-registered.event';
import { CreateUserCommand } from './create-user.command';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async create(command: CreateUserCommand): Promise<User> {
    const existing = await this.userRepository.findByEmail(command.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(command.password, 10);

    const user = await this.userRepository.create({
      email: command.email,
      passwordHash,
      role: command.role ?? UserRole.USER,
    });

    this.eventPublisher.publish(new UserRegisteredEvent(user.id, user.email));

    return user;
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async update(user: User): Promise<User> {
    return this.userRepository.update(user);
  }
}
