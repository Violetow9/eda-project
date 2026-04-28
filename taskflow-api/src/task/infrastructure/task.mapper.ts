import { Task, TaskStatus } from '../domain/task.entity';
import { TypeOrmTask } from './typeorm-task.entity';

export function toDomain(row: TypeOrmTask): Task {
  return new Task({
    id: row.id,
    title: row.title,
    status: TaskStatus.from(row.status),
    projectId: row.projectId,
    assigneeUserId: row.assigneeUserId,
  });
}
