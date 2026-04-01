import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post,} from '@nestjs/common';
import {ProjectService} from '../application/project.service';
import {Project} from '../domain/project.entity';
import {CreateProjectDto} from './create-project.dto';

@Controller({
    path: 'project',
    version: '1'
})
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {
    }

    @Get()
    getAllProjects(): Promise<Project[]> {
        return this.projectService.getAll();
    }

    @Get(':id')
    getProjectById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Project | null> {
        return this.projectService.getById(id);
    }

    @Get('name/:projectName')
    getProjectByName(
        @Param('projectName') projectName: string,
    ): Promise<Project | null> {
        return this.projectService.getByName(projectName);
    }

    @Post()
    createProject(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
        return this.projectService.create(createProjectDto);
    }

    @Delete(':id')
    deleteProject(@Param('id') id: number): Promise<void> {
        return this.projectService.delete(id);
    }
}
