import {DomainEvent} from '../../event/domain/domain-event.interface';

export class TaskMovedEvent implements DomainEvent {
    readonly eventType = 'task.moved';

    constructor(
        readonly taskId: number,
        readonly from: string,
        readonly to: string,
    ) {}
}
