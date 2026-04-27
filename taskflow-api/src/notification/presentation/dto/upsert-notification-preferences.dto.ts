import { IsBoolean } from 'class-validator';

export class UpsertNotificationPreferencesDto {
  @IsBoolean()
  emailEnabled: boolean;

  @IsBoolean()
  inAppEnabled: boolean;
}
