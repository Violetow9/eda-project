import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AssignTaskDto {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    userId!: string;
}
