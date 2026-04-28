import {DomainEvent} from '../../event/domain/domain-event.interface';

export class ProjectCreatedEvent implements DomainEvent {
    readonly eventType = 'project.created';

    constructor(
        readonly projectId: number,
        readonly projectName: string,
    ) {}
}
