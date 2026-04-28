import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post} from '@nestjs/common';
import {ProjectService} from '../application/project.service';
import {Project} from '../domain/project.entity';
import {CreateProjectDto} from './create-project.dto';
import {AddMemberDto} from './add-member.dto';
import {Roles} from '../../auth/presentation/decorators/roles.decorator';
import {CurrentUser} from '../../auth/presentation/decorators/current-user.decorator';
import {AuthenticatedUser} from '../../auth/domain/authenticated-user.entity';

@Controller({path: 'project', version: '1'})
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Roles('admin')
    @Get()
    getAll(): Promise<Project[]> {
        return this.projectService.getAll();
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number): Promise<Project> {
        return this.projectService.getById(id);
    }

    @Post()
    create(@Body() dto: CreateProjectDto, @CurrentUser() user: AuthenticatedUser): Promise<Project> {
        return this.projectService.create({
            projectName: dto.projectName,
            creatorId: user.id,
        });
    }

    @Post(':id/members')
    addMember(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: AddMemberDto,
    ): Promise<Project> {
        return this.projectService.addMember(id, dto.userId);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.projectService.delete(id);
    }
}
