import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';
import { ProjectService } from '../../project/application/project.service';
import { TaskMovedEvent } from 'src/task/domain/task-moved.event';
import { TaskAssignedEvent } from 'src/task/domain/task-assigned.event';


@Injectable()
export class NotificationListener {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly projectService: ProjectService,
  ) {}

  @OnEvent('task.moved')
  async handleTaskMoved(event: TaskMovedEvent): Promise<void> {

    const project = await this.projectService.getById(event.projectId);
    const members =
    project.members && project.members.length > 0
      ? project.members
      : ['user-1'];

    await Promise.all(
      members.map((memberUserId) =>
        this.notificationService.notifyUser({
          userId: memberUserId,
          type: 'task.moved',
          title: 'Task moved',
          message: `La tâche ${event.taskId} a été déplacée par ${event.actorId ?? 'user-1'}`, 
          metadata: {
            projectId: event.projectId,
            taskId: event.taskId,
            from: event.from,
            to: event.to,
            movedBy: event.actorId ?? 'user-1',
          },
        }),
      ),
    );
  }

  @OnEvent('task.assigned')
  async handleTaskAssigned(event: TaskAssignedEvent): Promise<void> {

    await this.notificationService.notifyUser({
      userId: event.assigneeUserId,
      type: 'task.assigned',
      title: 'Task assigned',
      message: `La tâche ${event.taskId} a été assignée à ${event.assigneeUserId}`, 
      metadata: {
        projectId: event.projectId,
        taskId: event.taskId,
      },
    });
  }
}
