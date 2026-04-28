import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProjectCreatedEvent } from '../../project/domain/project-created.event';
import { MemberAddedEvent } from '../../project/domain/member-added.event';
import { ProjectDeletedEvent } from '../../project/domain/project-deleted.event';
import { TaskCreatedEvent } from '../../task/domain/task-created.event';
import { TaskMovedEvent } from '../../task/domain/task-moved.event';
import { TaskDeletedEvent } from '../../task/domain/task-deleted.event';
import { TaskAssignedEvent } from '../../task/domain/task-assigned.event';
import { AuditService } from './audit.service';

@Injectable()
export class AuditListener {
  constructor(private readonly auditService: AuditService) {}

  @OnEvent('project.created')
  handleProjectCreated(event: ProjectCreatedEvent): Promise<unknown> {
    return this.auditService.log({
      actorId: event.actorId,
      action: 'project.created',
      entityType: 'Project',
      entityId: event.projectId,
      metadata: { projectName: event.projectName },
    });
  }

  @OnEvent('project.deleted')
  handleProjectDeleted(event: ProjectDeletedEvent): Promise<unknown> {
    return this.auditService.log({
      actorId: event.actorId,
      action: 'project.deleted',
      entityType: 'Project',
      entityId: event.projectId,
      metadata: { projectName: event.projectName },
    });
  }

  @OnEvent('member.added')
  handleMemberAdded(event: MemberAddedEvent): Promise<unknown> {
    return this.auditService.log({
      actorId: event.actorId,
      action: 'member.added',
      entityType: 'Project',
      entityId: event.projectId,
      metadata: { userId: event.userId },
    });
  }

  @OnEvent('task.created')
  handleTaskCreated(event: TaskCreatedEvent): Promise<unknown> {
    return this.auditService.log({
      actorId: event.actorId,
      action: 'task.created',
      entityType: 'Task',
      entityId: event.task.id,
      metadata: {
        projectId: event.projectId,
        title: event.task.title,
        status: event.task.status.toString(),
        assigneeUserId: event.task.assigneeUserId,
      },
    });
  }

  @OnEvent('task.assigned')
  handleTaskAssigned(event: TaskAssignedEvent): Promise<unknown> {
    return this.auditService.log({
      actorId: event.actorId,
      action: 'task.assigned',
      entityType: 'Task',
      entityId: event.taskId,
      metadata: {
        projectId: event.projectId,
        assigneeUserId: event.assigneeUserId,
        title: event.title,
      },
    });
  }

  @OnEvent('task.moved')
  handleTaskMoved(event: TaskMovedEvent): Promise<unknown> {
    return this.auditService.log({
      actorId: event.actorId,
      action: 'task.moved',
      entityType: 'Task',
      entityId: event.taskId,
      metadata: {
        projectId: event.projectId,
        from: event.from,
        to: event.to,
      },
    });
  }

  @OnEvent('task.deleted')
  handleTaskDeleted(event: TaskDeletedEvent): Promise<unknown> {
    return this.auditService.log({
      actorId: event.actorId,
      action: 'task.deleted',
      entityType: 'Task',
      entityId: event.taskId,
      metadata: { projectId: event.projectId },
    });
  }
}
