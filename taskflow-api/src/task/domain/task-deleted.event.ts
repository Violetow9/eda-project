export class TaskDeletedEvent {
    constructor(
        readonly projectId: number,
        readonly taskId: number,    
        readonly actorId: string = 'system',
    ) {}
}
