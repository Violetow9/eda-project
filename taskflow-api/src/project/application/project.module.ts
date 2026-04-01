import { Module } from '@nestjs/common';
import { ProjectController } from '../presentation/project.controller';
import { ProjectService } from './project.service';
import { Project } from '../domain/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
