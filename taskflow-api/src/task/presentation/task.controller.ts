import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TaskService } from '../application/task.service';
import { Task, TaskStatus } from '../domain/task.entity';
import { CreateTaskDto } from './create-task.dto';
import { MoveTaskDto } from './move-task.dto';

@Controller({ path: 'task', version: '1' })
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Get()
    getAll(): Promise<Task[]> {
        return this.taskService.getAll();
    }

    @Get('project/:projectId')
    getAllByProject(@Param('projectId', ParseIntPipe) projectId: number): Promise<Task[]> {
        return this.taskService.getAllByProjectId(projectId);
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
        return this.taskService.getById(id);
    }

    @Post()
    create(@Body() dto: CreateTaskDto): Promise<Task> {
        return this.taskService.create(dto);
    }

    @Patch(':id/move')
    move(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: MoveTaskDto,
    ): Promise<Task> {
        return this.taskService.moveTask(id, TaskStatus.from(dto.status));
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.taskService.delete(id);
    }
}
