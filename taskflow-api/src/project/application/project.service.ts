import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Project} from '../domain/project.entity';
import type {ProjectRepository} from '../domain/project.repository.interface';
import {PROJECT_REPOSITORY} from './project.constants';
import type {EventPublisher} from '../../event/application/event-publisher.interface';
import {EVENT_PUBLISHER} from '../../event/application/event.constants';
import {ProjectCreatedEvent} from '../domain/project-created.event';
import {MemberAddedEvent} from '../domain/member-added.event';
import {CreateProjectCommand} from './create-project.command';

@Injectable()
export class ProjectService {
    constructor(
        @Inject(PROJECT_REPOSITORY)
        private readonly projectRepository: ProjectRepository,
        @Inject(EVENT_PUBLISHER)
        private readonly eventPublisher: EventPublisher,
    ) {}

    async getAll(): Promise<Project[]> {
        return this.projectRepository.findAll();
    }

    async getById(id: number): Promise<Project> {
        const project = await this.projectRepository.findOne(id);
        if (!project) throw new NotFoundException(`Project with id ${id} not found`);
        return project;
    }

    async delete(id: number): Promise<void> {
        return this.projectRepository.remove(id);
    }

    async create(command: CreateProjectCommand): Promise<Project> {
        const project = await this.projectRepository.create({
            projectName: command.projectName,
            members: [command.creatorId],
        });
        this.eventPublisher.publish(new ProjectCreatedEvent(project.id, project.projectName));
        return project;
    }

    async addMember(projectId: number, userId: string): Promise<Project> {
        const project = await this.getById(projectId);
        const updated = project.addMember(userId);
        const saved = await this.projectRepository.update(updated);
        this.eventPublisher.publish(new MemberAddedEvent(saved.id, userId));
        return saved;
    }
}
