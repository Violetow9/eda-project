import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '../../domain/task.entity';
import type { TaskRepository } from '../../domain/task.repository.interface';
import { TaskStatus } from '../../domain/task.entity';
import { TaskMovedEvent } from '../../domain/task-moved.event';
import type { EventPublisher } from 'src/event/application/event-publisher.interface';
import { TASK_REPOSITORY } from '../task.constants';
import { EVENT_PUBLISHER } from 'src/event/application/event.constants';

export type MoveTaskCommand = {
  taskId: number;
  newStatus: TaskStatus;
  actorId?: string;
};

@Injectable()
export class MoveTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,

    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: MoveTaskCommand): Promise<Task> {
    const task = await this.taskRepository.findOne(command.taskId);

    if (!task) {
      throw new NotFoundException(`Task with id ${command.taskId} not found`);
    }

    const previousStatus = task.status.toString();
    const moved = task.move(command.newStatus);
    const saved = await this.taskRepository.update(moved);

    this.eventPublisher.publish(
      'task.moved',
      new TaskMovedEvent(
        saved.projectId,
        saved.id,
        previousStatus,
        saved.status.toString(),
        command.actorId ?? 'system',
      ),
    );

    return saved;
  }
}