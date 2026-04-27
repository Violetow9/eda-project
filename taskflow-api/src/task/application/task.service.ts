import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from '../domain/task.entity';
import type { TaskRepository } from '../domain/task.repository.interface';
import { TASK_REPOSITORY } from './task.constants';
import { CreateTaskDto } from '../presentation/create-task.dto';
import type { EventPublisher } from '../../event/application/event-publisher.interface';
import { EVENT_PUBLISHER } from '../../event/application/event.constants';
import { TaskCreatedEvent } from '../domain/task-created.event';
import { TaskMovedEvent } from '../domain/task-moved.event';
import { TaskDeletedEvent } from '../domain/task-deleted.event';
import { TaskAssignedEvent } from '../domain/task-assigned.event';

@Injectable()
export class TaskService {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async getAll(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }

  async getById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne(id);
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    return task;
  }

  async getAllByProjectId(projectId: number): Promise<Task[]> {
    return this.taskRepository.findAllByProjectId(projectId);
  }

  async delete(id: number): Promise<void> {
    const task = await this.getById(id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    
    this.eventPublisher.publish(
      'task.deleted',
      new TaskDeletedEvent(task.projectId, id),
    );

    return this.taskRepository.remove(id);
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const task = await this.taskRepository.create({
      title: dto.title,
      projectId: dto.projectId,
      assigneeUserId: dto.assigneeUserId ?? null,
      status: TaskStatus.TODO,
    });

    this.eventPublisher.publish(
      'task.created',
      new TaskCreatedEvent(task.projectId, task),
    );
    if (task.assigneeUserId) {
      this.eventPublisher.publish(
        'task.assigned',
        new TaskAssignedEvent(
          task.projectId,
          task.id,
          task.assigneeUserId,
          task.title,
        ),
      );
}

    return task;
  }

  async moveTask(id: number, newStatus: TaskStatus): Promise<Task> {
    const task = await this.getById(id);
    const previousStatus = task.status.toString();
    const moved = task.move(newStatus);
    const saved = await this.taskRepository.update(moved);

    this.eventPublisher.publish(
      'task.moved',
      new TaskMovedEvent(
        saved.projectId,
        saved.id,
        previousStatus,
        saved.status.toString(),
      ),
    );

    return saved;
  }
}
