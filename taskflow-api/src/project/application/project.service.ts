import {Inject, Injectable} from '@nestjs/common';
import {Project} from '../domain/project.entity';
import type {ProjectRepository} from '../domain/project.repository.interface';
import {PROJECT_REPOSITORY} from "./project.constants";

@Injectable()
export class ProjectService {
    constructor(
        @Inject(PROJECT_REPOSITORY)
        private readonly projectsRepository: ProjectRepository
    ) {
    }

    findAll(): Promise<Project[]> {
        return this.projectsRepository.findAll();
    }

    findOne(id: number): Promise<Project | null> {
        return this.projectsRepository.findOne(id);
    }

    findOneByName(projectName: string): Promise<Project | null> {
        return this.projectsRepository.findOneByName(projectName);
    }

    async remove(id: number): Promise<void> {
        await this.projectsRepository.remove(id);
    }

    async create(project: Project) {
        await this.projectsRepository.create(project);
    }
}
