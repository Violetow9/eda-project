import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectRepository } from '../domain/project.repository.interface';
import { Project } from '../domain/project.entity';
import { TypeOrmProject } from './typeorm-project.entity';
import { toDomain } from './project.mapper';

@Injectable()
export class TypeOrmProjectRepository implements ProjectRepository {
  constructor(
    @InjectRepository(TypeOrmProject)
    private readonly repo: Repository<TypeOrmProject>,
  ) {}

  async update(project: Project): Promise<Project> {
    await this.repo.update(project.id, {
      projectName: project.projectName,
      members: project.members,
    });
    const row = await this.repo.findOneBy({ id: project.id });
    return toDomain(row!);
  }

  async create(project: Partial<Project>): Promise<Project> {
    const row = this.repo.create({
      projectName: project.projectName,
      members: project.members ?? [],
    });
    await this.repo.save(row);
    return toDomain(row);
  }

  async findAll(): Promise<Project[]> {
    const rows = await this.repo.find();
    return rows.map(toDomain);
  }

  async findOne(id: number): Promise<Project | null> {
    const row = await this.repo.findOneBy({ id });
    return row ? toDomain(row) : null;
  }

  async findOneByName(projectName: string): Promise<Project | null> {
    const row = await this.repo.findOneBy({ projectName });
    return row ? toDomain(row) : null;
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
