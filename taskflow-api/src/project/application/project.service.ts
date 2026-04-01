import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Project} from '../domain/project.entity';
import type {ProjectRepository} from '../domain/project.repository.interface';
import {PROJECT_REPOSITORY} from "./project.constants";
import {CreateProjectDto} from "../presentation/create-project.dto";


@Injectable()
export class ProjectService {
    constructor(
        @Inject(PROJECT_REPOSITORY)
        private readonly projectRepository: ProjectRepository
    ) {
    }

    async getAll(): Promise<Project[]> {
        return await this.projectRepository.findAll();
    }

    async getById(id: number): Promise<Project> {
        const project = await this.projectRepository.findOne(id);

        if (!project) {
            throw new NotFoundException(`Project with id ${id} not found`);
        }

        return project;
    }

    async getByName(projectName: string): Promise<Project> {
        const project = await this.projectRepository.findOneByName(projectName);

        if (!project) {
            throw new NotFoundException(`Project ${projectName} not found`);
        }

        return project;
    }

    async delete(id: number): Promise<void> {
        return await this.projectRepository.remove(id);
    }

    async create(createProjectDto: CreateProjectDto): Promise<Project> {
        return await this.projectRepository.create({
            projectName: createProjectDto.projectName
        });
    }
}
