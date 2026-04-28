import { Injectable } from '@nestjs/common';
import { CreateProjectUseCase } from '../../project/application/use-cases/create-project.use-case';
import { CreateTaskUseCase } from '../../task/application/use-cases/create-task.use-case';
import { MoveTaskUseCase } from '../../task/application/use-cases/move-task.use-case';
import { TaskStatus } from '../../task/domain/task.entity';

@Injectable()
export class AdminCliCommand {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly moveTaskUseCase: MoveTaskUseCase,
  ) {}

  async createProject(projectName: string): Promise<void> {
    const project = await this.createProjectUseCase.execute({
      projectName,
      actorId: 'cli',
    });

    console.log(`Project created: #${project.id} - ${project.projectName}`);
  }

  async createTask(
    projectId: number,
    title: string,
    assigneeUserId?: string,
  ): Promise<void> {
    const task = await this.createTaskUseCase.execute({
      projectId,
      title,
      assigneeUserId: assigneeUserId ?? null,
      actorId: 'cli',
    });

    console.log(
      `Task created: #${task.id} - ${task.title} in project #${task.projectId}`,
    );
  }

  async seedDemo(): Promise<void> {
    const project = await this.createProjectUseCase.execute({
      projectName: 'Demo Kanban Project',
      actorId: 'cli',
    });

    const todoTask = await this.createTaskUseCase.execute({
      projectId: project.id,
      title: 'Préparer le backlog',
      assigneeUserId: 'user-1',
      actorId: 'cli',
    });

    const inProgressTask = await this.createTaskUseCase.execute({
      projectId: project.id,
      title: 'Implémenter le temps réel',
      assigneeUserId: 'user-1',
      actorId: 'cli',
    });

    const doneTask = await this.createTaskUseCase.execute({
      projectId: project.id,
      title: 'Créer le module projet',
      assigneeUserId: 'user-2',
      actorId: 'cli',
    });

    await this.moveTaskUseCase.execute({
      taskId: inProgressTask.id,
      newStatus: TaskStatus.IN_PROGRESS,
      actorId: 'cli',
    });

    await this.moveTaskUseCase.execute({
      taskId: doneTask.id,
      newStatus: TaskStatus.IN_PROGRESS,
      actorId: 'cli',
    });

    await this.moveTaskUseCase.execute({
      taskId: doneTask.id,
      newStatus: TaskStatus.DONE,
      actorId: 'cli',
    });

    console.log('Demo dataset created');
    console.log(`Project: #${project.id} - ${project.projectName}`);
    console.log(`TODO: #${todoTask.id} - ${todoTask.title}`);
    console.log(`IN_PROGRESS: #${inProgressTask.id} - ${inProgressTask.title}`);
    console.log(`DONE: #${doneTask.id} - ${doneTask.title}`);
  }
}