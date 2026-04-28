import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Task, TaskStatus} from '../domain/task.entity';
import type {TaskRepository} from '../domain/task.repository.interface';
import {TASK_REPOSITORY} from './task.constants';
import type {EventPublisher} from '../../event/application/event-publisher.interface';
import {EVENT_PUBLISHER} from '../../event/application/event.constants';
import {TaskCreatedEvent} from '../domain/task-created.event';
import {TaskMovedEvent} from '../domain/task-moved.event';
import {TaskAssignedEvent} from '../domain/task-assigned.event';
import {CreateTaskCommand} from './create-task.command';

@Injectable()
export class TaskService {
    constructor(
        @Inject(TASK_REPOSITORY)
        private readonly taskRepository: TaskRepository,
        @Inject(EVENT_PUBLISHER)
        private readonly eventPublisher: EventPublisher,
    ) {}

    async getAll(): Promise<Task[]> {
        return this.taskRepository.findAll();
    }

    async getById(id: number): Promise<Task> {
        const task = await this.taskRepository.findOne(id);
        if (!task) throw new NotFoundException(`Task with id ${id} not found`);
        return task;
    }

    async getAllByProjectId(projectId: number): Promise<Task[]> {
        return this.taskRepository.findAllByProjectId(projectId);
    }

    async delete(id: number): Promise<void> {
        return this.taskRepository.remove(id);
    }

    async create(command: CreateTaskCommand): Promise<Task> {
        const task = await this.taskRepository.create({
            title: command.title,
            projectId: command.projectId,
            assigneeUserId: command.assigneeUserId ?? null,
            status: TaskStatus.TODO,
        });

        this.eventPublisher.publish(new TaskCreatedEvent(task.id, task.title, task.projectId));

        return task;
    }

    async moveTask(id: number, newStatus: TaskStatus): Promise<Task> {
        const task = await this.getById(id);
        const previousStatus = task.status.toString();
        const moved = task.move(newStatus);
        const saved = await this.taskRepository.update(moved);

        this.eventPublisher.publish(new TaskMovedEvent(saved.id, previousStatus, saved.status.toString()));

        return saved;
    }

    async assignTask(id: number, userId: string): Promise<Task> {
        const task = await this.getById(id);
        const assigned = task.assign(userId);
        const saved = await this.taskRepository.update(assigned);

        this.eventPublisher.publish(new TaskAssignedEvent(saved.id, userId, saved.projectId));

        return saved;
    }

    async unassignTask(id: number): Promise<Task> {
        const task = await this.getById(id);
        const unassigned = task.unassign();
        return this.taskRepository.update(unassigned);
    }
}
