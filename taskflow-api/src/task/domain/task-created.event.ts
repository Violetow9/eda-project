import { Task } from "./task.entity";

export class TaskCreatedEvent {
  constructor(
    readonly projectId: number,
    readonly task: Task,
    readonly actorId: string = 'system',
  ) {}
}
