import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ProjectService } from '../application/project.service';
import { Project } from '../domain/project.entity';
import { CreateProjectDto } from './create-project.dto';

@Controller({ path: 'project', version: '1' })
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Get()
    getAll(): Promise<Project[]> {
        return this.projectService.getAll();
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number): Promise<Project> {
        return this.projectService.getById(id);
    }

    @Post()
    create(@Body() dto: CreateProjectDto): Promise<Project> {
        return this.projectService.create(dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.projectService.delete(id);
    }
}
