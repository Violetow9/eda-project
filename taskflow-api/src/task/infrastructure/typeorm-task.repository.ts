import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskRepository } from '../domain/task.repository.interface';
import { Task } from '../domain/task.entity';
import { TypeOrmTask } from './typeorm-task.entity';
import { toDomain } from './task.mapper';

@Injectable()
export class TypeOrmTaskRepository implements TaskRepository {
  constructor(
    @InjectRepository(TypeOrmTask)
    private readonly repo: Repository<TypeOrmTask>,
  ) {}

  async create(task: Partial<Task>): Promise<Task> {
    const row = this.repo.create({
      title: task.title,
      status: task.status?.toString() ?? 'Todo',
      projectId: task.projectId,
      assigneeUserId: task.assigneeUserId ?? null,
    });
    await this.repo.save(row);
    return toDomain(row);
  }

  async findAll(): Promise<Task[]> {
    const rows = await this.repo.find();
    return rows.map(toDomain);
  }

  async findOne(id: number): Promise<Task | null> {
    const row = await this.repo.findOneBy({ id });
    return row ? toDomain(row) : null;
  }

  async findAllByProjectId(projectId: number): Promise<Task[]> {
    const rows = await this.repo.findBy({ projectId });
    return rows.map(toDomain);
  }

  async update(task: Task): Promise<Task> {
    await this.repo.update(task.id, {
      title: task.title,
      status: task.status.toString(),
      assigneeUserId: task.assigneeUserId,
    });
    const row = await this.repo.findOneBy({ id: task.id });
    return toDomain(row!);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
