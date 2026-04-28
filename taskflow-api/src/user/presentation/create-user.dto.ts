import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../domain/user.entity';

export class CreateUserDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    password!: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}
