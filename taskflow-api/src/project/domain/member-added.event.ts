import { DomainEvent } from '../../event/domain/domain-event.interface';

export class MemberAddedEvent implements DomainEvent {
  readonly eventType = 'member.added';

  constructor(
    readonly projectId: number,
    readonly userId: string,
    readonly actorId: string = 'system',
  ) {}
}
