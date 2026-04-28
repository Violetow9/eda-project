import { DomainEvent } from '../../event/domain/domain-event.interface';

export class TaskDeletedEvent implements DomainEvent {
  readonly eventType = 'task.deleted';

  constructor(
    readonly projectId: number,
    readonly taskId: number,
    readonly actorId: string = 'system',
  ) {}
}
