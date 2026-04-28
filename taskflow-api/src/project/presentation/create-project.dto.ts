import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
    @IsNotEmpty()
    @IsString()
    projectName: string;

    @IsOptional()
    @IsString()
    actorId?: string;
}
