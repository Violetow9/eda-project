export class TaskDeletedEvent {
    constructor(
        readonly projectId: number,
        readonly taskId: number,
    ) {}
}
