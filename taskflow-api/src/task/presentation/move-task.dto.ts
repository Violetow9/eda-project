import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MoveTaskDto {
  @IsNotEmpty()
  @IsIn(['Todo', 'In Progress', 'Done'])
  status: string;

  @IsOptional()
  @IsString()
  actorId?: string;
}
