import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNumber()
    projectId: number;

    @IsOptional()
    @IsString()
    assigneeUserId?: string | null;
}
