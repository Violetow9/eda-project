import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectRepository } from '../domain/project.repository.interface';
import { TypeOrmProject } from '../domain/typeorm-project.entity';

@Injectable()
export class TypeOrmProjectRepository implements ProjectRepository {
  constructor(
    @InjectRepository(TypeOrmProject)
    private projectsRepository: Repository<TypeOrmProject>,
  ) {}

  findAll(): Promise<TypeOrmProject[]> {
    return this.projectsRepository.find();
  }

  findOne(id: number): Promise<TypeOrmProject | null> {
    return this.projectsRepository.findOneBy({ id });
  }

  findOneByName(projectName: string): Promise<TypeOrmProject | null> {
    return this.projectsRepository.findOneBy({ projectName });
  }

  async remove(id: number): Promise<void> {
    await this.projectsRepository.delete(id);
  }

  async create(project: TypeOrmProject) {
    await this.projectsRepository.save(project);
  }
}
