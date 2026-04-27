import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('notification_preferences')
@Unique(['userId'])
export class TypeOrmNotificationPreference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({ default: true })
  emailEnabled: boolean;

  @Column({ default: true })
  inAppEnabled: boolean;
}
