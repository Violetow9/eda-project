export type TaskStatus = 'Todo' | 'In Progress' | 'Done';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  assigneeUserId?: string | null;
  projectId?: number;
}