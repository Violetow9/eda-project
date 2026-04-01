import { IsIn, IsNotEmpty } from 'class-validator';

export class MoveTaskDto {
    @IsNotEmpty()
    @IsIn(['Todo', 'In Progress', 'Done'])
    status: string;
}
