import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ProjectRepository } from '../domain/project.repository.interface';
import { TypeOrmProject } from './typeorm-project.entity';
import { Project } from '../domain/project.entity';
import { toDomain, toTypeOrm } from './project.mapper';

@Injectable()
export class TypeOrmProjectRepository implements ProjectRepository {
    constructor(
        @InjectRepository(TypeOrmProject)
        private readonly repo: Repository<TypeOrmProject>,
    ) {}

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

    async create(project: Project): Promise<void> {
        await this.repo.save(toTypeOrm(project));
    }
}
