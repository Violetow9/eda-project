import { forwardRef, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EVENT_PUBLISHER } from './event.constants';
import { NestEventPublisher } from '../infrastructure/nest.event-publisher';
import { ConsoleListener } from '../infrastructure/console.listener';
import { ServerListener } from '../infrastructure/server.listener';
import { TaskModule } from 'src/task/application/task.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({ wildcard: true }),
    forwardRef(() => TaskModule),
  ],
  providers: [
    { provide: EVENT_PUBLISHER, useClass: NestEventPublisher },
    ConsoleListener,
    ServerListener,
  ],
  exports: [EVENT_PUBLISHER],
})
export class EventModule {}
