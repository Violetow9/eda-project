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
import { CreateTaskUseCase } from './use-cases/create-task.use-case';
import { MoveTaskUseCase } from './use-cases/move-task.use-case';

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
    CreateTaskUseCase,
    MoveTaskUseCase,
  ],
  exports: [
    TASK_REPOSITORY,
    TaskService,
    TaskGateway,
    CreateTaskUseCase,
    MoveTaskUseCase,
  ],
  controllers: [TaskController],
})
export class TaskModule {}
