import {Project} from './project.entity';

export interface ProjectRepository {
    findAll(): Promise<Project[]>;

    findOne(id: number): Promise<Project | null>;

    findOneByName(projectName: string): Promise<Project | null>;

    remove(id: number): Promise<void>;

    create(project: Project): Promise<void>;
}
