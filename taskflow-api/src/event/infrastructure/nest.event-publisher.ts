import {EventPublisher} from "../application/event-publisher.interface";
import {Injectable} from "@nestjs/common";
import {EventEmitter2} from "@nestjs/event-emitter";

@Injectable()
export class NestEventPublisher implements EventPublisher {
    constructor(private readonly eventEmitter: EventEmitter2) {
    }

    publish(event: string, data: any): void {
        this.eventEmitter.emit(event, data);
    }
}