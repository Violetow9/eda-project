import {Injectable, Logger} from '@nestjs/common';
import {OnEvent} from '@nestjs/event-emitter';
import {TaskCreatedEvent} from '../../task/domain/task-created.event';
import {TaskMovedEvent} from '../../task/domain/task-moved.event';
import {TaskAssignedEvent} from '../../task/domain/task-assigned.event';
import {ProjectCreatedEvent} from '../../project/domain/project-created.event';
import {MemberAddedEvent} from '../../project/domain/member-added.event';
import {UserRegisteredEvent} from '../../user/domain/user-registered.event';

@Injectable()
export class ConsoleListener {
    private readonly logger = new Logger(ConsoleListener.name);

    @OnEvent('task.created')
    handleTaskCreated(payload: TaskCreatedEvent): void {
        this.logger.log(
            `[task.created] taskId=${payload.task.id}, ${payload.task.assigneeUserId} at ${new Date().toISOString()}`,
        );
    }

    @OnEvent('task.moved')
    handleTaskMoved(payload: TaskMovedEvent): void {
        this.logger.log(
            `[task.moved] taskId=${payload.taskId} ${payload.from} -> ${payload.to} at ${new Date().toISOString()}`,
        );
    }

    @OnEvent('task.assigned')
    handleTaskAssigned(payload: TaskAssignedEvent): void {
        this.logger.log(
            `[task.assigned] taskId=${payload.taskId} assigneeUserId=${payload.assigneeUserId} at ${new Date().toISOString()}`,
        );
    }

    @OnEvent('project.created')
    handleProjectCreated(payload: ProjectCreatedEvent): void {
        this.logger.log(
            `[project.created] projectId=${payload.projectId} name="${payload.projectName}" at ${new Date().toISOString()}`,
        );
    }

    @OnEvent('member.added')
    handleMemberAdded(payload: MemberAddedEvent): void {
        this.logger.log(
            `[member.added] projectId=${payload.projectId} userId=${payload.userId} at ${new Date().toISOString()}`,
        );
    }

    @OnEvent('user.registered')
    handleUserRegistered(payload: UserRegisteredEvent): void {
        this.logger.log(
            `[user.registered] userId=${payload.userId} email=${payload.email} at ${new Date().toISOString()}`,
        );
    }
}
