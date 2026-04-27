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
import { Task } from '../domain/task.entity';
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

    client.join(this.getProjectRoom(payload.projectId));
    console.log('join room project:', payload.projectId);
    return {
      joined: true,
      room: this.getProjectRoom(payload.projectId),
    };
  }

  emitTaskMoved(payload: {
    projectId: number;
    taskId: number;
    from: string;
    to: string;
  }): void {
    this.server
      .to(this.getProjectRoom(payload.projectId))
      .emit('task.moved', payload);
  }

  emitTaskCreated(payload: { projectId: number; task: Task }): void {
    this.server
      .to(this.getProjectRoom(payload.projectId))
      .emit('task.created', payload);
  }
  emitTaskAssigned(payload: TaskAssignedEvent): void {
    this.server
      .to(this.getProjectRoom(payload.projectId))
      .emit('task.assigned', payload);
  }


  emitTaskDeleted(payload: TaskDeletedEvent): void {
    this.server
      .to(this.getProjectRoom(payload.projectId))
      .emit('task.deleted', payload);
  }
}
