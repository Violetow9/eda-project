import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from '../presentation/task.controller';
import { TaskService } from './task.service';
import { TASK_REPOSITORY } from './task.constants';
import { TypeOrmTaskRepository } from '../infrastructure/typeorm-task.repository';
import { TypeOrmTask } from '../infrastructure/typeorm-task.entity';
import { EventModule } from '../../event/application/event.module';
import { TaskGateway } from '../infrastructure/task.gateway';
import { ProjectAccessService } from './project-access.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeOrmTask]),
    forwardRef(() => EventModule),
  ],
  providers: [
    TypeOrmTaskRepository,
    { provide: TASK_REPOSITORY, useClass: TypeOrmTaskRepository },
    TaskService,
    TaskGateway,
    ProjectAccessService,
  ],
  exports: [TASK_REPOSITORY, TaskService, TaskGateway],
  controllers: [TaskController],
})
export class TaskModule {}
