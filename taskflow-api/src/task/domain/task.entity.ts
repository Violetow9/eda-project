export type TaskStatus = 'Todo' | 'In Progress' | 'Done';

interface TaskConstructorParams {
  id: number;
  title: string;
  status: TaskStatus;
  assigneeUserId?: string | null;
  projectId?: number;
}

export class Task {
  readonly id: number;
  readonly title: string;
  readonly status: TaskStatus;
  readonly assigneeUserId?: string | null;
  readonly projectId?: number;
  constructor({
    id,
    title,
    status,
    assigneeUserId,
    projectId,
  }: TaskConstructorParams) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.assigneeUserId = assigneeUserId;
    this.projectId = projectId;
  }
}
