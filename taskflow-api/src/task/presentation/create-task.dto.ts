import { IsNotEmpty, IsString } from 'class-validator';
import { TaskStatus } from '../domain/task.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  status: TaskStatus;
  assigneeUserId?: string | null;
  projectId?: number;
}
