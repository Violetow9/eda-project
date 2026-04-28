import {DomainEvent} from '../../event/domain/domain-event.interface';

export class TaskAssignedEvent implements DomainEvent {
    readonly eventType = 'task.assigned';

    constructor(
        readonly taskId: number,
        readonly assigneeUserId: string,
        readonly projectId: number,
    ) {}
}
