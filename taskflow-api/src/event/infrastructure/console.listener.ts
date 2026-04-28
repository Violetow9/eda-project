import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskCreatedEvent } from '../../task/domain/task-created.event';
import { TaskMovedEvent } from '../../task/domain/task-moved.event';
import { TaskAssignedEvent } from '../../task/domain/task-assigned.event';
import { TaskDeletedEvent } from '../../task/domain/task-deleted.event';
import { ProjectCreatedEvent } from '../../project/domain/project-created.event';
import { ProjectDeletedEvent } from '../../project/domain/project-deleted.event';
import { MemberAddedEvent } from '../../project/domain/member-added.event';
import { UserRegisteredEvent } from '../../user/domain/user-registered.event';

@Injectable()
export class ConsoleListener {
  private readonly logger = new Logger(ConsoleListener.name);

  @OnEvent('task.created')
  handleTaskCreated(payload: TaskCreatedEvent): void {
    this.logger.log(
      `[task.created] taskId=${payload.taskId} title="${payload.title}" actor=${payload.actorId} at ${new Date().toISOString()}`,
    );
  }

  @OnEvent('task.moved')
  handleTaskMoved(payload: TaskMovedEvent): void {
    this.logger.log(
      `[task.moved] taskId=${payload.taskId} ${payload.from} -> ${payload.to} actor=${payload.actorId} at ${new Date().toISOString()}`,
    );
  }

  @OnEvent('task.assigned')
  handleTaskAssigned(payload: TaskAssignedEvent): void {
    this.logger.log(
      `[task.assigned] taskId=${payload.taskId} assigneeUserId=${payload.assigneeUserId} actor=${payload.actorId} at ${new Date().toISOString()}`,
    );
  }

  @OnEvent('task.deleted')
  handleTaskDeleted(payload: TaskDeletedEvent): void {
    this.logger.log(
      `[task.deleted] taskId=${payload.taskId} actor=${payload.actorId} at ${new Date().toISOString()}`,
    );
  }

  @OnEvent('project.created')
  handleProjectCreated(payload: ProjectCreatedEvent): void {
    this.logger.log(
      `[project.created] projectId=${payload.projectId} name="${payload.projectName}" actor=${payload.actorId} at ${new Date().toISOString()}`,
    );
  }

  @OnEvent('project.deleted')
  handleProjectDeleted(payload: ProjectDeletedEvent): void {
    this.logger.log(
      `[project.deleted] projectId=${payload.projectId} name="${payload.projectName}" actor=${payload.actorId} at ${new Date().toISOString()}`,
    );
  }

  @OnEvent('member.added')
  handleMemberAdded(payload: MemberAddedEvent): void {
    this.logger.log(
      `[member.added] projectId=${payload.projectId} userId=${payload.userId} actor=${payload.actorId} at ${new Date().toISOString()}`,
    );
  }

  @OnEvent('user.registered')
  handleUserRegistered(payload: UserRegisteredEvent): void {
    this.logger.log(
      `[user.registered] userId=${payload.userId} email=${payload.email} at ${new Date().toISOString()}`,
    );
  }
}
