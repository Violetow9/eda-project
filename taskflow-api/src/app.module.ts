import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PostgresModule} from "./postgres/postgres.module";
import {ConfigModule} from "@nestjs/config";
import {validationConfig} from "./config/validation.config";
import {ProjectModule} from "./project/application/project.module";
import {EventModule} from "./event/application/event.module";
import { TaskService } from './task/application/task.service';
import { TaskModule } from './task/application/task.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            cache: true,
            validationSchema: validationConfig
        }),
        PostgresModule,
        EventModule,
        ProjectModule
        TaskModule
    ],
    controllers: [AppController],
    providers: [AppService, TaskService],
})
export class AppModule {
}
