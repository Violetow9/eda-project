export class TaskAssignedEvent {
  constructor(
    readonly projectId: number,
    readonly taskId: number,
    readonly assigneeUserId: string,
    readonly title: string,
  ) {}
}
