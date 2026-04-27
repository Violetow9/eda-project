import {Module} from '@nestjs/common';
import {PostgresModule} from './postgres/postgres.module';
import {ConfigModule} from '@nestjs/config';
import {validationConfig} from './config/validation.config';
import {EventModule} from './event/application/event.module';
import {ProjectModule} from './project/application/project.module';
import {TaskModule} from './task/application/task.module';
import { NotificationModule } from './notification/notification.module';
import { AuditModule } from './audit/audit.module';

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
        NotificationModule,
        AuditModule,

    ]
})
export class AppModule {
}
