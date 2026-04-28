import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskService } from '../application/task.service';
import { Task, TaskStatus } from '../domain/task.entity';
import { CreateTaskDto } from './create-task.dto';
import { MoveTaskDto } from './move-task.dto';
import { AssignTaskDto } from './assign-task.dto';
import { CurrentUser } from '../../auth/presentation/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../auth/domain/authenticated-user.entity';

@Controller({ path: 'task', version: '1' })
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  getAll(): Promise<Task[]> {
    return this.taskService.getAll();
  }

  @Get('project/:projectId')
  getAllByProject(
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<Task[]> {
    return this.taskService.getAllByProjectId(projectId);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.getById(id);
  }

  @Post()
  create(
    @Body() dto: CreateTaskDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Task> {
    return this.taskService.create({
      title: dto.title,
      projectId: dto.projectId,
      assigneeUserId: dto.assigneeUserId,
      actorId: user.id,
    });
  }

  @Patch(':id/move')
  move(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: MoveTaskDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Task> {
    return this.taskService.moveTask(id, TaskStatus.from(dto.status), user.id);
  }

  @Patch(':id/assign')
  assign(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignTaskDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Task> {
    return this.taskService.assignTask(id, dto.userId, user.id);
  }

  @Patch(':id/unassign')
  unassign(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.unassignTask(id);
  }

  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.taskService.delete(id, user.id);
  }
}
