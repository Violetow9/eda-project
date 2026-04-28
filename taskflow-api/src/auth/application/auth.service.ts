import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {UserService} from '../../user/application/user.service';
import type {TokenProvider} from '../domain/token-provider.interface';
import {TOKEN_PROVIDER} from './auth.constants';
import {TokenPair} from '../domain/token-pair';
import {RegisterCommand} from './register.command';
import {LoginCommand} from './login.command';
import {UserRole} from '../../user/domain/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        @Inject(TOKEN_PROVIDER)
        private readonly tokenProvider: TokenProvider,
    ) {}

    async register(command: RegisterCommand): Promise<TokenPair> {
        const user = await this.userService.create({
            email: command.email,
            password: command.password,
            role: UserRole.USER,
        });

        return this.tokenProvider.generate({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
    }

    async login(command: LoginCommand): Promise<TokenPair> {
        const user = await this.userService.findByEmail(command.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const valid = await bcrypt.compare(command.password, user.passwordHash);
        if (!valid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.tokenProvider.generate({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
    }
}
