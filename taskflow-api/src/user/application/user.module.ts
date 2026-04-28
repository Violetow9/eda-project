import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUser } from '../infrastructure/typeorm-user.entity';
import { EventModule } from '../../event/application/event.module';
import { TypeormUserRepository } from '../infrastructure/typeorm-user.repository';
import { USER_REPOSITORY } from './user.constants';
import { UserService } from './user.service';
import { UserController } from '../presentation/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmUser]), EventModule],
  providers: [
    TypeormUserRepository,
    {
      provide: USER_REPOSITORY,
      useClass: TypeormUserRepository,
    },
    UserService,
  ],
  exports: [USER_REPOSITORY, UserService],
  controllers: [UserController],
})
export class UserModule {}
