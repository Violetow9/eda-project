import { Task } from './task.entity';

export interface TaskRepository {
  findAll(): Promise<Task[]>;

  findOne(id: number): Promise<Task | null>;

  findAllByProjectId(projectId: number): Promise<Task[] | null>;

  remove(id: number): Promise<void>;

  create(project: Partial<Task>): Promise<Task>;
}
