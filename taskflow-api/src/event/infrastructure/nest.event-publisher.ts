import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventPublisher } from '../application/event-publisher.interface';
import { DomainEvent } from '../domain/domain-event.interface';

@Injectable()
export class NestEventPublisher implements EventPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  publish(event: DomainEvent): void {
    this.eventEmitter.emit(event.eventType, event);
  }
}
