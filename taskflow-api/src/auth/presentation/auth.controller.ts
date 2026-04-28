import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {AuthService} from '../application/auth.service';
import {RegisterDto} from './register.dto';
import {LoginDto} from './login.dto';
import {TokenPair} from '../domain/token-pair';
import {Public} from './decorators/public.decorator';

@Public()
@Controller({path: 'auth', version: '1'})
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() dto: RegisterDto): Promise<TokenPair> {
        return this.authService.register({
            email: dto.email,
            password: dto.password,
        });
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto): Promise<TokenPair> {
        return this.authService.login({
            email: dto.email,
            password: dto.password,
        });
    }
}
