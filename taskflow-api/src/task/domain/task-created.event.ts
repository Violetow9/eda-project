import {DomainEvent} from '../../event/domain/domain-event.interface';

export class TaskCreatedEvent implements DomainEvent {
    readonly eventType = 'task.created';

    constructor(
        readonly taskId: number,
        readonly title: string,
        readonly projectId: number,
    ) {}
}
