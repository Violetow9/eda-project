export class TaskMovedEvent {
    constructor(
        readonly taskId: number,
        readonly from: string,
        readonly to: string,
    ) {}
}
