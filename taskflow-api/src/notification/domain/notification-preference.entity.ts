export class NotificationPreference {
  constructor(
    public readonly id: number | null,
    public readonly userId: string,
    public readonly emailEnabled: boolean,
    public readonly inAppEnabled: boolean,
  ) {}
}
