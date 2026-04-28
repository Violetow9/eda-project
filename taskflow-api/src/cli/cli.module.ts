import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventModule } from 'src/event/application/event.module';
import { PostgresModule } from 'src/postgres/postgres.module';
import { ProjectModule } from 'src/project/application/project.module';
import { TaskModule } from 'src/task/application/task.module';
import { AdminCliCommand } from './presentation/admin-cli.command';
import { AuditModule } from 'src/audit/audit.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
    }),
    PostgresModule,
    EventModule,
    ProjectModule,
    TaskModule,
    AuditModule,
    NotificationModule,
  ],
  providers: [AdminCliCommand],
})
export class CliModule {}
