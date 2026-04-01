import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskCreatedEvent } from '../../task/domain/task-created.event';
import { TaskMovedEvent } from '../../task/domain/task-moved.event';

@Injectable()
export class ConsoleListener {
    private readonly logger = new Logger(ConsoleListener.name);

    @OnEvent('task.created')
    handleTaskCreated(payload: TaskCreatedEvent): void {
        this.logger.log(
            `[task.created] taskId=${payload.taskId} at ${new Date().toISOString()}`,
        );
    }

    @OnEvent('task.moved')
    handleTaskMoved(payload: TaskMovedEvent): void {
        this.logger.log(
            `[task.moved] taskId=${payload.taskId} ${payload.from} → ${payload.to} at ${new Date().toISOString()}`,
        );
    }
}
