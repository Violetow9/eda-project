import { Injectable, NotFoundException } from '@nestjs/common';
import type { ProjectRepository } from '../domain/project.repository.interface';
import { Project } from '../domain/project.entity';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

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

  async create(projectData: { projectName: string }): Promise<Project> {
    return await this.projectRepository.create(projectData);
  }
}
