import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Version,} from '@nestjs/common';
import {ProjectService} from '../application/project.service';
import {Project} from '../domain/project.entity';
import {CreateProjectDto} from './create-project.dto';
import {AddMemberDto} from './add-member.dto';
import {Roles} from '../../auth/presentation/decorators/roles.decorator';
import {CurrentUser} from '../../auth/presentation/decorators/current-user.decorator';
import {AuthenticatedUser} from '../../auth/domain/authenticated-user.entity';

@Controller({path: 'project'})
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {
    }

    @Version('1')
    @Roles('admin')
    @Get()
    getAll(): Promise<Project[]> {
        return this.projectService.getAll();
    }

    @Version('1')
    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number): Promise<Project> {
        return this.projectService.getById(id);
    }

    @Version('1')
    @Post()
    create(
        @Body() dto: CreateProjectDto,
        @CurrentUser() user: AuthenticatedUser,
    ): Promise<Project> {
        return this.projectService.create({
            projectName: dto.projectName,
            creatorId: user.id,
            actorId: user.id,
        });
    }

    @Version('1')
    @Post(':id/members')
    addMember(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AddMemberDto,
        @CurrentUser() user: AuthenticatedUser,
    ): Promise<Project> {
        return this.projectService.addMember(id, dto.userId, user.id);
    }

    @Version('1')
    @Delete(':id')
    deleteV1(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: AuthenticatedUser,
    ): Promise<void> {
        return this.projectService.delete(id, user.id);
    }

    @Version('2')
    @Delete(':id')
    deleteV2(): { message: string } {
        return {message: 'Project deletion is not allowed in version 2. Please use version 1 to delete projects.'};
    }
}
