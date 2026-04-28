import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProjectService } from './project.service';
import { PROJECT_REPOSITORY } from './project.constants';
import { EVENT_PUBLISHER } from '../../event/application/event.constants';
import { Project } from '../domain/project.entity';
import { ProjectRepository } from '../domain/project.repository.interface';
import { EventPublisher } from '../../event/application/event-publisher.interface';
import { ProjectCreatedEvent } from '../domain/project-created.event';
import { MemberAddedEvent } from '../domain/member-added.event';

const makeProject = (
  overrides: Partial<ConstructorParameters<typeof Project>[0]> = {},
): Project =>
  new Project({ id: 1, projectName: 'TaskFlow', members: [], ...overrides });

describe('Project entity', () => {
  it('throws when project name is empty', () => {
    expect(() => makeProject({ projectName: '' })).toThrow(
      'Project name cannot be empty',
    );
    expect(() => makeProject({ projectName: '   ' })).toThrow(
      'Project name cannot be empty',
    );
  });

  describe('addMember()', () => {
    it('returns a new Project with the member added (immutability)', () => {
      const project = makeProject({ members: [] });
      const updated = project.addMember('user-1');

      expect(updated).not.toBe(project);
      expect(updated.members).toContain('user-1');
      expect(project.members).not.toContain('user-1');
    });

    it('preserves existing members when adding a new one', () => {
      const project = makeProject({ members: ['user-1'] });
      const updated = project.addMember('user-2');

      expect(updated.members).toEqual(['user-1', 'user-2']);
    });

    it('throws when user is already a member', () => {
      const project = makeProject({ members: ['user-1'] });

      expect(() => project.addMember('user-1')).toThrow(
        'User user-1 is already a member of this project',
      );
    });
  });
});

describe('ProjectService', () => {
  let service: ProjectService;
  let projectRepo: jest.Mocked<ProjectRepository>;
  let eventPublisher: jest.Mocked<EventPublisher>;

  beforeEach(async () => {
    projectRepo = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findOneByName: jest.fn(),
      remove: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
    eventPublisher = { publish: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        { provide: PROJECT_REPOSITORY, useValue: projectRepo },
        { provide: EVENT_PUBLISHER, useValue: eventPublisher },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  describe('create()', () => {
    it('publishes project.created with correct payload', async () => {
      const project = makeProject({ id: 5, projectName: 'TaskFlow' });
      projectRepo.create.mockResolvedValue(project);

      await service.create({ projectName: 'TaskFlow', creatorId: 'creator-1' });

      expect(eventPublisher.publish).toHaveBeenCalledTimes(1);
      expect(eventPublisher.publish).toHaveBeenCalledWith(
        expect.objectContaining<Partial<ProjectCreatedEvent>>({
          eventType: 'project.created',
          projectId: 5,
          projectName: 'TaskFlow',
        }),
      );
    });

    it('creates project with creator as first member', async () => {
      const project = makeProject({ id: 5 });
      projectRepo.create.mockResolvedValue(project);

      await service.create({ projectName: 'TaskFlow', creatorId: 'creator-1' });

      expect(projectRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ members: ['creator-1'] }),
      );
    });

    it('does not publish any event when the repository throws', async () => {
      projectRepo.create.mockRejectedValue(new Error('db error'));

      await expect(
        service.create({ projectName: 'TaskFlow', creatorId: 'creator-1' }),
      ).rejects.toThrow();
      expect(eventPublisher.publish).not.toHaveBeenCalled();
    });

    it('returns the created project', async () => {
      const project = makeProject({ projectName: 'TaskFlow' });
      projectRepo.create.mockResolvedValue(project);

      const result = await service.create({
        projectName: 'TaskFlow',
        creatorId: 'creator-1',
      });

      expect(result).toBe(project);
    });
  });

  describe('getById()', () => {
    it('returns the project when it exists', async () => {
      const project = makeProject();
      projectRepo.findOne.mockResolvedValue(project);

      const result = await service.getById(1);

      expect(result).toBe(project);
    });

    it('throws NotFoundException when project does not exist', async () => {
      projectRepo.findOne.mockResolvedValue(null);

      await expect(service.getById(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('addMember()', () => {
    it('publishes member.added with correct payload', async () => {
      const project = makeProject({ id: 3, members: [] });
      const saved = makeProject({ id: 3, members: ['user-42'] });
      projectRepo.findOne.mockResolvedValue(project);
      projectRepo.update.mockResolvedValue(saved);

      await service.addMember(3, 'user-42');

      expect(eventPublisher.publish).toHaveBeenCalledTimes(1);
      expect(eventPublisher.publish).toHaveBeenCalledWith(
        expect.objectContaining<Partial<MemberAddedEvent>>({
          eventType: 'member.added',
          projectId: 3,
          userId: 'user-42',
        }),
      );
    });

    it('persists the updated project', async () => {
      const project = makeProject({ members: [] });
      const saved = makeProject({ members: ['user-1'] });
      projectRepo.findOne.mockResolvedValue(project);
      projectRepo.update.mockResolvedValue(saved);

      const result = await service.addMember(1, 'user-1');

      expect(projectRepo.update).toHaveBeenCalledTimes(1);
      expect(result.members).toContain('user-1');
    });

    it('throws NotFoundException when project does not exist', async () => {
      projectRepo.findOne.mockResolvedValue(null);

      await expect(service.addMember(99, 'user-1')).rejects.toThrow(
        NotFoundException,
      );
      expect(projectRepo.update).not.toHaveBeenCalled();
      expect(eventPublisher.publish).not.toHaveBeenCalled();
    });

    it('does not call update or publish when user is already a member', async () => {
      const project = makeProject({ members: ['user-1'] });
      projectRepo.findOne.mockResolvedValue(project);

      await expect(service.addMember(1, 'user-1')).rejects.toThrow(
        'User user-1 is already a member of this project',
      );
      expect(projectRepo.update).not.toHaveBeenCalled();
      expect(eventPublisher.publish).not.toHaveBeenCalled();
    });
  });
});
