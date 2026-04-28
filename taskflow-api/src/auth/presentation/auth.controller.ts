import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
import { TokenPair } from '../domain/token-pair';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthenticatedUser } from '../domain/authenticated-user.entity';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto): Promise<TokenPair> {
    return this.authService.register({
      email: dto.email,
      password: dto.password,
    });
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<TokenPair> {
    return this.authService.login({
      email: dto.email,
      password: dto.password,
    });
  }

  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser): {
    id: string;
    email: string;
    role: string;
  } {
    return { id: user.id, email: user.email, role: user.role };
  }
}
