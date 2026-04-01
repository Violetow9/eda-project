export interface EventPublisher {
    publish(event: string, data: any): void;
}
