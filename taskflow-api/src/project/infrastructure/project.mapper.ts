import { Project } from '../domain/project.entity';
import { TypeOrmProject } from './typeorm-project.entity';

export function toDomain(row: TypeOrmProject): Project {
    return new Project({ id: row.id, projectName: row.projectName });
}
