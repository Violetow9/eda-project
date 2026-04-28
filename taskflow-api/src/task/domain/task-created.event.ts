import { DomainEvent } from '../../event/domain/domain-event.interface';

export class TaskCreatedEvent implements DomainEvent {
  readonly eventType = 'task.created';

  constructor(
    readonly projectId: number,
    readonly taskId: number,
    readonly title: string,
    readonly status: string,
    readonly assigneeUserId: string | null,
    readonly actorId: string = 'system',
  ) {}
}
