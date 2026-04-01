import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from '../presentation/task.controller';
import { TaskService } from './task.service';
import { TASK_REPOSITORY } from './task.constants';
import { TypeOrmTaskRepository } from '../infrastructure/typeorm-task.repository';
import { TypeOrmTask } from '../infrastructure/typeorm-task.entity';
import { EventModule } from '../../event/application/event.module';

@Module({
    imports: [TypeOrmModule.forFeature([TypeOrmTask]), EventModule],
    providers: [
        TypeOrmTaskRepository,
        { provide: TASK_REPOSITORY, useClass: TypeOrmTaskRepository },
        TaskService,
    ],
    exports: [TASK_REPOSITORY, TaskService],
    controllers: [TaskController],
})
export class TaskModule {}
