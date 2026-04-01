import { Project } from './project.entity';

export interface ProjectRepository {
    findAll(): Promise<Project[]>;
    findOne(id: number): Promise<Project | null>;
    findOneByName(projectName: string): Promise<Project | null>;
    remove(id: number): Promise<void>;
    create(project: Partial<Project>): Promise<Project>;
    update(project: Project): Promise<Project>;
}
