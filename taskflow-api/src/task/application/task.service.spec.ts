import {Test, TestingModule} from '@nestjs/testing';
import {NotFoundException} from '@nestjs/common';
import {TaskService} from './task.service';
import {TASK_REPOSITORY} from './task.constants';
import {EVENT_PUBLISHER} from '../../event/application/event.constants';
import {Task, TaskStatus} from '../domain/task.entity';
import {TaskRepository} from '../domain/task.repository.interface';
import {EventPublisher} from '../../event/application/event-publisher.interface';
import {TaskCreatedEvent} from '../domain/task-created.event';
import {TaskMovedEvent} from '../domain/task-moved.event';

const makeTask = (overrides: Partial<ConstructorParameters<typeof Task>[0]> = {}): Task =>
    new Task({id: 1, title: 'Fix bug', status: TaskStatus.TODO, projectId: 10, ...overrides});

describe('TaskStatus', () => {
    describe('valid transitions', () => {
        it('Todo → In Progress', () => {
            expect(TaskStatus.TODO.moveTo(TaskStatus.IN_PROGRESS)).toBe(TaskStatus.IN_PROGRESS);
        });

        it('In Progress → Done', () => {
            expect(TaskStatus.IN_PROGRESS.moveTo(TaskStatus.DONE)).toBe(TaskStatus.DONE);
        });
    });

    describe('invalid transitions', () => {
        it('Todo → Done (skip)', () => {
            expect(() => TaskStatus.TODO.moveTo(TaskStatus.DONE)).toThrow(
                'Cannot transition from "Todo" to "Done"',
            );
        });

        it('In Progress → Todo (backward)', () => {
            expect(() => TaskStatus.IN_PROGRESS.moveTo(TaskStatus.TODO)).toThrow(
                'Cannot transition from "In Progress" to "Todo"',
            );
        });

        it('Done → In Progress (backward)', () => {
            expect(() => TaskStatus.DONE.moveTo(TaskStatus.IN_PROGRESS)).toThrow(
                'Cannot transition from "Done" to "In Progress"',
            );
        });

        it('Done → Todo (backward)', () => {
            expect(() => TaskStatus.DONE.moveTo(TaskStatus.TODO)).toThrow(
                'Cannot transition from "Done" to "Todo"',
            );
        });
    });

    describe('from()', () => {
        it('parses known values', () => {
            expect(TaskStatus.from('Todo')).toBe(TaskStatus.TODO);
            expect(TaskStatus.from('In Progress')).toBe(TaskStatus.IN_PROGRESS);
            expect(TaskStatus.from('Done')).toBe(TaskStatus.DONE);
        });

        it('throws on unknown value', () => {
            expect(() => TaskStatus.from('unknown')).toThrow('Invalid task status: "unknown"');
        });
    });
});

describe('Task entity', () => {
    it('throws when title is empty', () => {
        expect(() => makeTask({title: ''})).toThrow('Task title cannot be empty');
        expect(() => makeTask({title: '   '})).toThrow('Task title cannot be empty');
    });

    it('move() returns a new Task instance (immutability)', () => {
        const task = makeTask({status: TaskStatus.TODO});
        const moved = task.move(TaskStatus.IN_PROGRESS);

        expect(moved).not.toBe(task);
        expect(moved.status).toBe(TaskStatus.IN_PROGRESS);
        expect(task.status).toBe(TaskStatus.TODO);
    });

    it('move() throws on invalid transition without mutating the task', () => {
        const task = makeTask({status: TaskStatus.TODO});

        expect(() => task.move(TaskStatus.DONE)).toThrow();
        expect(task.status).toBe(TaskStatus.TODO);
    });
});

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
        eventPublisher = {publish: jest.fn()};

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TaskService,
                {provide: TASK_REPOSITORY, useValue: taskRepo},
                {provide: EVENT_PUBLISHER, useValue: eventPublisher},
            ],
        }).compile();

        service = module.get<TaskService>(TaskService);
    });

    describe('create()', () => {
        it('forces status to Todo regardless of any input', async () => {
            const task = makeTask({status: TaskStatus.TODO});
            taskRepo.create.mockResolvedValue(task);

            await service.create({title: 'Fix bug', projectId: 10});

            expect(taskRepo.create).toHaveBeenCalledWith(
                expect.objectContaining({status: TaskStatus.TODO}),
            );
        });

        it('publishes task.created with correct payload', async () => {
            const task = makeTask({id: 42, title: 'Fix bug', projectId: 10});
            taskRepo.create.mockResolvedValue(task);

            await service.create({title: 'Fix bug', projectId: 10});

            expect(eventPublisher.publish).toHaveBeenCalledTimes(1);
            expect(eventPublisher.publish).toHaveBeenCalledWith(
                'task.created',
                expect.objectContaining<Partial<TaskCreatedEvent>>({
                    taskId: 42,
                    title: 'Fix bug',
                    projectId: 10,
                }),
            );
        });

        it('does not publish any event when the repository throws', async () => {
            taskRepo.create.mockRejectedValue(new Error('db error'));

            await expect(service.create({title: 'Fix bug', projectId: 10})).rejects.toThrow();
            expect(eventPublisher.publish).not.toHaveBeenCalled();
        });
    });

    describe('moveTask()', () => {
        it('moves task from Todo to In Progress and persists it', async () => {
            const task = makeTask({status: TaskStatus.TODO});
            const saved = makeTask({status: TaskStatus.IN_PROGRESS});
            taskRepo.findOne.mockResolvedValue(task);
            taskRepo.update.mockResolvedValue(saved);

            const result = await service.moveTask(1, TaskStatus.IN_PROGRESS);

            expect(taskRepo.update).toHaveBeenCalledTimes(1);
            expect(result.status).toBe(TaskStatus.IN_PROGRESS);
        });

        it('moves task from In Progress to Done and persists it', async () => {
            const task = makeTask({status: TaskStatus.IN_PROGRESS});
            const saved = makeTask({status: TaskStatus.DONE});
            taskRepo.findOne.mockResolvedValue(task);
            taskRepo.update.mockResolvedValue(saved);

            const result = await service.moveTask(1, TaskStatus.DONE);

            expect(taskRepo.update).toHaveBeenCalledTimes(1);
            expect(result.status).toBe(TaskStatus.DONE);
        });

        it('publishes task.moved with correct from/to payload', async () => {
            const task = makeTask({id: 7, status: TaskStatus.TODO});
            const saved = makeTask({id: 7, status: TaskStatus.IN_PROGRESS});
            taskRepo.findOne.mockResolvedValue(task);
            taskRepo.update.mockResolvedValue(saved);

            await service.moveTask(7, TaskStatus.IN_PROGRESS);

            expect(eventPublisher.publish).toHaveBeenCalledTimes(1);
            expect(eventPublisher.publish).toHaveBeenCalledWith(
                'task.moved',
                expect.objectContaining<Partial<TaskMovedEvent>>({
                    taskId: 7,
                    from: 'Todo',
                    to: 'In Progress',
                }),
            );
        });

        it('does not call update when transition is invalid', async () => {
            const task = makeTask({status: TaskStatus.TODO});
            taskRepo.findOne.mockResolvedValue(task);

            await expect(service.moveTask(1, TaskStatus.DONE)).rejects.toThrow();
            expect(taskRepo.update).not.toHaveBeenCalled();
        });

        it('does not publish any event when transition is invalid', async () => {
            const task = makeTask({status: TaskStatus.TODO});
            taskRepo.findOne.mockResolvedValue(task);

            await expect(service.moveTask(1, TaskStatus.DONE)).rejects.toThrow();
            expect(eventPublisher.publish).not.toHaveBeenCalled();
        });

        it('throws NotFoundException when task does not exist', async () => {
            taskRepo.findOne.mockResolvedValue(null);

            await expect(service.moveTask(99, TaskStatus.IN_PROGRESS)).rejects.toThrow(
                NotFoundException,
            );
            expect(taskRepo.update).not.toHaveBeenCalled();
            expect(eventPublisher.publish).not.toHaveBeenCalled();
        });
    });
});
