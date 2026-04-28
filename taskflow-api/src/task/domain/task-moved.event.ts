import {DomainEvent} from '../../event/domain/domain-event.interface';

export class TaskMovedEvent implements DomainEvent {
    readonly eventType = 'task.moved';

    constructor(
        readonly projectId: number,
        readonly taskId: number,
        readonly from: string,
        readonly to: string,
        readonly actorId: string = 'system',
    ) {}
}
