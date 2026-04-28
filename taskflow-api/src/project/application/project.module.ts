import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from '../presentation/project.controller';
import { ProjectService } from './project.service';
import { PROJECT_REPOSITORY } from './project.constants';
import { TypeOrmProjectRepository } from '../infrastructure/typeorm-project.repository';
import { TypeOrmProject } from '../infrastructure/typeorm-project.entity';
import { EventModule } from '../../event/application/event.module';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmProject]), EventModule],
  providers: [
    TypeOrmProjectRepository,
    { provide: PROJECT_REPOSITORY, useClass: TypeOrmProjectRepository },
    ProjectService,
  ],
  exports: [PROJECT_REPOSITORY, ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
