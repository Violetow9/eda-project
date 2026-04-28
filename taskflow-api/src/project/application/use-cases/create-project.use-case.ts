import { Inject, Injectable } from '@nestjs/common';
import { Project } from '../../domain/project.entity';
import type { ProjectRepository } from '../../domain/project.repository.interface';
import { ProjectCreatedEvent } from '../../domain/project-created.event';
import type { EventPublisher } from 'src/event/application/event-publisher.interface';
import { EVENT_PUBLISHER } from 'src/event/application/event.constants';
import { PROJECT_REPOSITORY } from '../project.constants';

export type CreateProjectCommand = {
  projectName: string;
  actorId?: string;
};

@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: ProjectRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateProjectCommand): Promise<Project> {
    const project = new Project({
      id: 0,
      projectName: command.projectName,
      members: [],
    });

    const saved = await this.projectRepository.create(project);

    this.eventPublisher.publish(
      'project.created',
      new ProjectCreatedEvent(
        saved.id,
        saved.projectName,
        command.actorId ?? 'system',
      ),
    );

    return saved;
  }
}