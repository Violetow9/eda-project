import { Injectable } from '@nestjs/common';
import { ProjectService } from '../../project/application/project.service';
import { TaskService } from '../../task/application/task.service';
import { TaskStatus } from '../../task/domain/task.entity';

const CLI_ACTOR_ID = 'cli';

@Injectable()
export class AdminCliCommand {
  constructor(
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService,
  ) {}

  async createProject(projectName: string): Promise<void> {
    const project = await this.projectService.create({
      projectName,
      creatorId: CLI_ACTOR_ID,
      actorId: CLI_ACTOR_ID,
    });

    console.log(`Project created: #${project.id} - ${project.projectName}`);
  }

  async createTask(
    projectId: number,
    title: string,
    assigneeUserId?: string,
  ): Promise<void> {
    const task = await this.taskService.create({
      projectId,
      title,
      assigneeUserId: assigneeUserId ?? null,
      actorId: CLI_ACTOR_ID,
    });

    console.log(
      `Task created: #${task.id} - ${task.title} in project #${task.projectId}`,
    );
  }

  async seedDemo(): Promise<void> {
    const project = await this.projectService.create({
      projectName: 'Demo Kanban Project',
      creatorId: CLI_ACTOR_ID,
      actorId: CLI_ACTOR_ID,
    });

    const todoTask = await this.taskService.create({
      projectId: project.id,
      title: 'Préparer le backlog',
      assigneeUserId: 'user-1',
      actorId: CLI_ACTOR_ID,
    });

    const inProgressTask = await this.taskService.create({
      projectId: project.id,
      title: 'Implémenter le temps réel',
      assigneeUserId: 'user-1',
      actorId: CLI_ACTOR_ID,
    });

    const doneTask = await this.taskService.create({
      projectId: project.id,
      title: 'Créer le module projet',
      assigneeUserId: 'user-2',
      actorId: CLI_ACTOR_ID,
    });

    await this.taskService.moveTask(
      inProgressTask.id,
      TaskStatus.IN_PROGRESS,
      CLI_ACTOR_ID,
    );
    await this.taskService.moveTask(
      doneTask.id,
      TaskStatus.IN_PROGRESS,
      CLI_ACTOR_ID,
    );
    await this.taskService.moveTask(doneTask.id, TaskStatus.DONE, CLI_ACTOR_ID);

    console.log('Demo dataset created');
    console.log(`Project: #${project.id} - ${project.projectName}`);
    console.log(`TODO: #${todoTask.id} - ${todoTask.title}`);
    console.log(`IN_PROGRESS: #${inProgressTask.id} - ${inProgressTask.title}`);
    console.log(`DONE: #${doneTask.id} - ${doneTask.title}`);
  }
}
