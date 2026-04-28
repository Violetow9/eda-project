import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from '../project/application/project.module';
import { NotificationService } from './application/notification.service';
import { NotificationPreferenceService } from './application/notification-preference.service';
import { NotificationListener } from './application/notification.listener';
import { NotificationPreferenceController } from './presentation/notification-preference.controller';
import { NotificationController } from './presentation/notification.controller';
import { TypeOrmNotification } from './infrastructure/persistence/typeorm-notification.entity';
import { TypeOrmNotificationPreference } from './infrastructure/persistence/typeorm-notification-preference.entity';
import { TypeOrmNotificationRepository } from './infrastructure/persistence/typeorm-notification.repository';
import { TypeOrmNotificationPreferenceRepository } from './infrastructure/persistence/typeorm-notification-preference.repository';
import { SmtpEmailChannel } from './infrastructure/channels/smtp-email.channel';
import { InAppChannel } from './infrastructure/channels/in-app.channel';
import {
  EMAIL_NOTIFICATION_CHANNEL,
  IN_APP_NOTIFICATION_CHANNEL,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_PREFERENCE_REPOSITORY,
  NOTIFICATION_REPOSITORY,
} from './notification.constants';
import { NotificationChannel } from './domain/notification-channel.interface';
import { FailedNotificationQueueService } from './application/failed-notification-queue.service';
import { TypeOrmFailedNotificationMessage } from './infrastructure/persistence/typeorm-failed-notification.entity';
import { FailedNotificationController } from './presentation/failed-notification.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TypeOrmNotification,
      TypeOrmNotificationPreference, TypeOrmFailedNotificationMessage
    ]),
    ProjectModule,
  ],
  controllers: [NotificationPreferenceController, NotificationController, FailedNotificationController],
  providers: [
    NotificationService,
    NotificationPreferenceService,
    FailedNotificationQueueService,
    NotificationListener,
    SmtpEmailChannel,
    InAppChannel,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: TypeOrmNotificationRepository,
    },
    {
      provide: NOTIFICATION_PREFERENCE_REPOSITORY,
      useClass: TypeOrmNotificationPreferenceRepository,
    },
    {
      provide: EMAIL_NOTIFICATION_CHANNEL,
      useExisting: SmtpEmailChannel,
    },
    {
      provide: IN_APP_NOTIFICATION_CHANNEL,
      useExisting: InAppChannel,
    },
    {
      provide: NOTIFICATION_CHANNELS,
      inject: [EMAIL_NOTIFICATION_CHANNEL, IN_APP_NOTIFICATION_CHANNEL],
      useFactory: (
        ...channels: NotificationChannel[]
      ): NotificationChannel[] => channels,
    },
  ],
  exports: [NotificationService, NotificationPreferenceService],
})
export class NotificationModule {}
