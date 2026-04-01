import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TaskService } from './task.service';
import { TASK_REPOSITORY } from './task.constants';
import { EVENT_PUBLISHER } from '../../event/application/event.constants';
import { Task, TaskStatus } from '../domain/task.entity';
import { TaskRepository } from '../domain/task.repository.interface';
import { EventPublisher } from '../../event/application/event-publisher.interface';
import { TaskCreatedEvent } from '../domain/task-created.event';
import { TaskMovedEvent } from '../domain/task-moved.event';

const makeTask = (overrides: Partial<ConstructorParameters<typeof Task>[0]> = {}): Task =>
    new Task({ id: 1, title: 'Fix bug', status: TaskStatus.TODO, projectId: 10, ...overrides });

describe('TaskService', () => {
    let service: TaskService;
    let taskRepo: jest.Mocked<TaskRepository>;
    let eventPublisher: jest.Mocked<EventPublisher>;

    beforeEach(async () => {
        taskRepo = {
            findAll: jest.fn(),
            findOne: jest.fn(),
            findAllByProjectId: jest.fn(),
            remove: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        };
        eventPublisher = { publish: jest.fn() };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TaskService,
                { provide: TASK_REPOSITORY, useValue: taskRepo },
                { provide: EVENT_PUBLISHER, useValue: eventPublisher },
            ],
        }).compile();

        service = module.get<TaskService>(TaskService);
    });

    describe('create', () => {
        it('should create a task with status Todo', async () => {
            const task = makeTask();
            taskRepo.create.mockResolvedValue(task);

            const result = await service.create({ title: 'Fix bug', projectId: 10 });

            expect(taskRepo.create).toHaveBeenCalledWith(
                expect.objectContaining({ status: TaskStatus.TODO }),
            );
            expect(result.status).toBe(TaskStatus.TODO);
        });

        it('should publish task.created event', async () => {
            const task = makeTask();
            taskRepo.create.mockResolvedValue(task);

            await service.create({ title: 'Fix bug', projectId: 10 });

            expect(eventPublisher.publish).toHaveBeenCalledWith(
                'task.created',
                expect.any(TaskCreatedEvent),
            );
        });
    });

    describe('moveTask', () => {
        it('should move task from Todo to In Progress', async () => {
            const task = makeTask({ status: TaskStatus.TODO });
            const moved = makeTask({ status: TaskStatus.IN_PROGRESS });
            taskRepo.findOne.mockResolvedValue(task);
            taskRepo.update.mockResolvedValue(moved);

            const result = await service.moveTask(1, TaskStatus.IN_PROGRESS);

            expect(result.status).toBe(TaskStatus.IN_PROGRESS);
            expect(taskRepo.update).toHaveBeenCalled();
        });

        it('should move task from In Progress to Done', async () => {
            const task = makeTask({ status: TaskStatus.IN_PROGRESS });
            const moved = makeTask({ status: TaskStatus.DONE });
            taskRepo.findOne.mockResolvedValue(task);
            taskRepo.update.mockResolvedValue(moved);

            const result = await service.moveTask(1, TaskStatus.DONE);

            expect(result.status).toBe(TaskStatus.DONE);
        });

        it('should publish task.moved event', async () => {
            const task = makeTask({ status: TaskStatus.TODO });
            const moved = makeTask({ status: TaskStatus.IN_PROGRESS });
            taskRepo.findOne.mockResolvedValue(task);
            taskRepo.update.mockResolvedValue(moved);

            await service.moveTask(1, TaskStatus.IN_PROGRESS);

            expect(eventPublisher.publish).toHaveBeenCalledWith(
                'task.moved',
                expect.any(TaskMovedEvent),
            );
        });

        it('should throw when transition is invalid (Todo → Done)', async () => {
            const task = makeTask({ status: TaskStatus.TODO });
            taskRepo.findOne.mockResolvedValue(task);

            await expect(service.moveTask(1, TaskStatus.DONE)).rejects.toThrow(
                'Cannot transition from "Todo" to "Done"',
            );
        });

        it('should throw when task is not found', async () => {
            taskRepo.findOne.mockResolvedValue(null);

            await expect(service.moveTask(99, TaskStatus.IN_PROGRESS)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('TaskStatus transitions', () => {
        it('Todo → In Progress is valid', () => {
            const next = TaskStatus.TODO.moveTo(TaskStatus.IN_PROGRESS);
            expect(next).toBe(TaskStatus.IN_PROGRESS);
        });

        it('In Progress → Done is valid', () => {
            const next = TaskStatus.IN_PROGRESS.moveTo(TaskStatus.DONE);
            expect(next).toBe(TaskStatus.DONE);
        });

        it('Todo → Done is invalid', () => {
            expect(() => TaskStatus.TODO.moveTo(TaskStatus.DONE)).toThrow();
        });

        it('Done → any is invalid', () => {
            expect(() => TaskStatus.DONE.moveTo(TaskStatus.TODO)).toThrow();
            expect(() => TaskStatus.DONE.moveTo(TaskStatus.IN_PROGRESS)).toThrow();
        });
    });
});
