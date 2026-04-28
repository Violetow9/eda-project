import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PostgresModule } from './postgres/postgres.module';
import { ConfigModule } from '@nestjs/config';
import { validationConfig } from './config/validation.config';
import { EventModule } from './event/application/event.module';
import { ProjectModule } from './project/application/project.module';
import { TaskModule } from './task/application/task.module';
import { UserModule } from './user/application/user.module';
import { AuthModule } from './auth/application/auth.module';
import { AuditModule } from './audit/audit.module';
import { NotificationModule } from './notification/notification.module';
import { JwtAuthGuard } from './auth/infrastructure/jwt-auth.guard';
import { RolesGuard } from './auth/infrastructure/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
      validationSchema: validationConfig,
    }),
    PostgresModule,
    EventModule,
    ProjectModule,
    TaskModule,
    UserModule,
    AuthModule,
    AuditModule,
    NotificationModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
