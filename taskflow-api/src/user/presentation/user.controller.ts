import {Controller, Get, NotFoundException, Param, ParseUUIDPipe} from '@nestjs/common';
import {User} from "../domain/user.entity";
import {UserService} from "../application/user.service";
import {Roles} from "../../auth/presentation/decorators/roles.decorator";

@Controller({path: 'user', version: '1'})
@Roles('admin')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get()
    getAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    async getById(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }
}
