import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ProjectRepository } from '../domain/project.repository.interface';
import { TypeOrmProject } from './typeorm-project.entity';

@Injectable()
export class TypeOrmProjectRepository implements ProjectRepository {
  constructor(
    @InjectRepository(TypeOrmProject)
    private readonly projectsRepository: Repository<TypeOrmProject>,
  ) {}

  async findAll(): Promise<TypeOrmProject[]> {
    return await this.projectsRepository.find();
  }

  async findOne(id: number): Promise<TypeOrmProject | null> {
    return await this.projectsRepository.findOneBy({ id });
  }

  async findOneByName(projectName: string): Promise<TypeOrmProject | null> {
    return await this.projectsRepository.findOneBy({ projectName });
  }

  async remove(id: number): Promise<void> {
    const result: DeleteResult = await this.projectsRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
  }

  async create(project: TypeOrmProject): Promise<TypeOrmProject> {
    return await this.projectsRepository.save(project);
  }
}
