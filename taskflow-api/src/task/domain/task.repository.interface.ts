import { Task } from './task.entity';

export interface TaskRepository {
  findAll(): Promise<Task[]>;
  findOne(id: number): Promise<Task | null>;
  findAllByProjectId(projectId: number): Promise<Task[]>;
  remove(id: number): Promise<void>;
  create(task: Partial<Task>): Promise<Task>;
  update(task: Task): Promise<Task>;
}
