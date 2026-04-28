import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TokenProvider} from '../domain/token-provider.interface';
import {AccessTokenPayload} from '../domain/token-payload';
import {TokenPair} from '../domain/token-pair';

@Injectable()
export class JwtTokenProvider implements TokenProvider {
    constructor(private readonly jwtService: JwtService) {}

    generate(payload: AccessTokenPayload): TokenPair {
        const accessToken = this.jwtService.sign(payload);
        return new TokenPair(accessToken);
    }

    verifyAccess(token: string): AccessTokenPayload {
        try {
            return this.jwtService.verify<AccessTokenPayload>(token);
        } catch {
            throw new UnauthorizedException('Invalid or expired access token');
        }
    }
}
