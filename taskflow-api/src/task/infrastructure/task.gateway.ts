import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { TaskCreatedEvent } from '../domain/task-created.event';
import { TaskMovedEvent } from '../domain/task-moved.event';
import { TaskDeletedEvent } from '../domain/task-deleted.event';
import { TaskAssignedEvent } from '../domain/task-assigned.event';
import { ProjectAccessService } from '../application/project-access.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001',
  },
})
@Injectable()
export class TaskGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly projectAccessService: ProjectAccessService) {}

  private getProjectRoom(projectId: number): string {
    return `project:${projectId}`;
  }

  @SubscribeMessage('project.join')
  async handleProjectJoin(
    @MessageBody() payload: { projectId: number; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const hasAccess = await this.projectAccessService.canAccessProject({
      userId: payload.userId,
      projectId: payload.projectId,
    });

    if (!hasAccess) {
      throw new WsException('Forbidden project');
    }

    void client.join(this.getProjectRoom(payload.projectId));
    return {
      joined: true,
      room: this.getProjectRoom(payload.projectId),
    };
  }

  emitTaskCreated(event: TaskCreatedEvent): void {
    this.server.to(this.getProjectRoom(event.projectId)).emit('task.created', {
      projectId: event.projectId,
      task: {
        id: event.taskId,
        title: event.title,
        status: event.status,
        projectId: event.projectId,
        assigneeUserId: event.assigneeUserId,
      },
    });
  }

  emitTaskMoved(event: TaskMovedEvent): void {
    this.server.to(this.getProjectRoom(event.projectId)).emit('task.moved', {
      projectId: event.projectId,
      taskId: event.taskId,
      from: event.from,
      to: event.to,
      movedBy: event.actorId,
    });
  }

  emitTaskAssigned(event: TaskAssignedEvent): void {
    this.server.to(this.getProjectRoom(event.projectId)).emit('task.assigned', {
      projectId: event.projectId,
      taskId: event.taskId,
      assigneeUserId: event.assigneeUserId,
      title: event.title,
    });
  }

  emitTaskDeleted(event: TaskDeletedEvent): void {
    this.server.to(this.getProjectRoom(event.projectId)).emit('task.deleted', {
      projectId: event.projectId,
      taskId: event.taskId,
    });
  }
}
