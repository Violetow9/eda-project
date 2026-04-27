export class TaskMovedEvent {
    constructor(
        readonly projectId: number,
        readonly taskId: number,
        readonly from: string,
        readonly to: string,
        readonly actorId: string = 'system',
    ) {}
}
