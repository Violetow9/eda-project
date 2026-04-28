import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { NotificationPreferenceService } from '../application/notification-preference.service';
import { UpsertNotificationPreferencesDto } from './dto/upsert-notification-preferences.dto';

@Controller('notification-preferences')
export class NotificationPreferenceController {
  constructor(
    private readonly notificationPreferenceService: NotificationPreferenceService,
  ) {}

  @Get(':userId')
  getByUserId(@Param('userId') userId: string) {
    return this.notificationPreferenceService.getByUserId(userId);
  }

  @Put(':userId')
  upsert(
    @Param('userId') userId: string,
    @Body() dto: UpsertNotificationPreferencesDto,
  ) {
    return this.notificationPreferenceService.upsert({
      userId,
      emailEnabled: dto.emailEnabled,
      inAppEnabled: dto.inAppEnabled,
    });
  }
}
