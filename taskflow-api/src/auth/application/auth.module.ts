import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from '../presentation/auth.controller';
import { JwtTokenProvider } from '../infrastructure/jwt-token-provider';
import { JwtAuthGuard } from '../infrastructure/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/roles.guard';
import { TOKEN_PROVIDER } from './auth.constants';
import { UserModule } from '../../user/application/user.module';
import { NotificationModule } from '../../notification/notification.module';

@Module({
  imports: [
    UserModule,
    NotificationModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (config: ConfigService): any => ({
        secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_ACCESS_TTL', '30d'),
        },
      }),
    }),
  ],
  providers: [
    JwtTokenProvider,
    { provide: TOKEN_PROVIDER, useClass: JwtTokenProvider },
    AuthService,
    JwtAuthGuard,
    RolesGuard,
  ],
  controllers: [AuthController],
  exports: [TOKEN_PROVIDER, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
