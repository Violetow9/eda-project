import {DomainEvent} from '../../event/domain/domain-event.interface';

export class UserRegisteredEvent implements DomainEvent {
    readonly eventType = 'user.registered';

    constructor(
        readonly userId: string,
        readonly email: string,
    ) {}
}
