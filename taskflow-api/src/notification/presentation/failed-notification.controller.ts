import { Controller, Get } from '@nestjs/common';
import { FailedNotificationQueueService } from '../application/failed-notification-queue.service';

@Controller({ path: 'failed-notification-messages', version: '1' })
export class FailedNotificationController {
  constructor(private readonly failedQueue: FailedNotificationQueueService) {}

  @Get()
  findAll() {
    return this.failedQueue.findAll();
  }
}
