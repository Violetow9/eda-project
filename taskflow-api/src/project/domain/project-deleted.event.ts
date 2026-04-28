import { DomainEvent } from '../../event/domain/domain-event.interface';

export class ProjectDeletedEvent implements DomainEvent {
  readonly eventType = 'project.deleted';

  constructor(
    readonly projectId: number,
    readonly projectName: string,
    readonly actorId: string = 'system',
  ) {}
}
