import { Module } from '@nestjs/common';
import { TaskController } from '../presentation/task.controller';

@Module({
  controllers: [TaskController],
})
export class TaskModule {}
