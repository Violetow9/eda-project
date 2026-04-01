import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Project } from '../domain/project.entity';
import type { ProjectRepository } from '../domain/project.repository.interface';
import { PROJECT_REPOSITORY } from './project.constants';
import { CreateProjectDto } from '../presentation/create-project.dto';
import type { EventPublisher } from '../../event/application/event-publisher.interface';
import { EVENT_PUBLISHER } from '../../event/application/event.constants';
import { ProjectCreatedEvent } from '../domain/project-created.event';

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

    async create(dto: CreateProjectDto): Promise<Project> {
        const project = await this.projectRepository.create({ projectName: dto.projectName });
        this.eventPublisher.publish('project.created', new ProjectCreatedEvent(project.id, project.projectName));
        return project;
    }
}
