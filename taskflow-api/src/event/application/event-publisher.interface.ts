import { DomainEvent } from '../domain/domain-event.interface';

export interface EventPublisher {
  publish(event: DomainEvent): void;
}
