import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskCreatedEvent } from '../../task/domain/task-created.event';
import { TaskMovedEvent } from '../../task/domain/task-moved.event';
import { TaskGateway } from 'src/task/infrastructure/task.gateway';
import { TaskDeletedEvent } from 'src/task/domain/task-deleted.event';
import { TaskAssignedEvent } from 'src/task/domain/task-assigned.event';

@Injectable()
export class ServerListener {
  constructor(private readonly gateway: TaskGateway) {}

  @OnEvent('task.created')
  handleTaskCreated(payload: TaskCreatedEvent): void {
    this.gateway.emitTaskCreated(payload);
  }

  @OnEvent('task.moved')
  handleTaskMoved(payload: TaskMovedEvent): void {
    this.gateway.emitTaskMoved(payload);
  }

  @OnEvent('task.assigned')
  handleTaskAssigned(payload: TaskAssignedEvent): void {
    this.gateway.emitTaskAssigned(payload);
  }

  @OnEvent('task.deleted')
  handleTaskDeleted(payload: TaskDeletedEvent): void {
    this.gateway.emitTaskDeleted(payload);
  }
}
