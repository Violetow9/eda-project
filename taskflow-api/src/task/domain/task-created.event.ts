export class TaskCreatedEvent {
    constructor(
        readonly taskId: number,
        readonly title: string,
        readonly projectId: number,
    ) {}
}
