import { Inject, Injectable } from '@nestjs/common';
import { Task } from '../../domain/task.entity';
import type { TaskRepository } from '../../domain/task.repository.interface';
import { TaskStatus } from '../../domain/task.entity';
import { TaskCreatedEvent } from '../../domain/task-created.event';
import { TaskAssignedEvent } from '../../domain/task-assigned.event';
import type { EventPublisher } from 'src/event/application/event-publisher.interface';
import { TASK_REPOSITORY } from '../task.constants';
import { EVENT_PUBLISHER } from 'src/event/application/event.constants';

export type CreateTaskCommand = {
  title: string;
  projectId: number;
  assigneeUserId?: string | null;
  actorId?: string;
};

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,

    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateTaskCommand): Promise<Task> {
    const task = new Task({
      id: 0,
      title: command.title,
      status: TaskStatus.TODO,
      projectId: command.projectId,
      assigneeUserId: command.assigneeUserId ?? null,
    });

    const saved = await this.taskRepository.create(task);

    this.eventPublisher.publish(
      'task.created',
      new TaskCreatedEvent(
        saved.projectId,
        saved,
        command.actorId ?? 'system',
      ),
    );

    if (saved.assigneeUserId) {
      this.eventPublisher.publish(
        'task.assigned',
        new TaskAssignedEvent(
          saved.projectId,
          saved.id,
          saved.assigneeUserId,
          saved.title,
          command.actorId ?? 'system',
        ),
      );
    }

    return saved;
  }
}