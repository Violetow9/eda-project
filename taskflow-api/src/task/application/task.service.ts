import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Task } from '../domain/task.entity';
import type { TaskRepository } from '../domain/task.repository.interface';
import { CreateTaskDto } from '../presentation/create-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async getAll(): Promise<Task[]> {
    return await this.taskRepository.findAll();
  }

  async getById(id: number): Promise<Task> {
    const project = await this.taskRepository.findOne(id);

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    return project;
  }

  async getAllByProjectId(projectId: number): Promise<Task[]> {
    const project = await this.taskRepository.findAllByProjectId(projectId);

    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }

    return project;
  }

  async delete(id: number): Promise<void> {
    return await this.taskRepository.remove(id);
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = await this.taskRepository.create({
      projectId: createTaskDto.projectId,
      title: createTaskDto.title,
      assigneeUserId: createTaskDto.assigneeUserId,
      status: createTaskDto.status,
    });

    return task;
  }
}
