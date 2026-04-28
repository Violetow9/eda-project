import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('failed_notification_messages')
export class TypeOrmFailedNotificationMessage {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  channel: string;
  @Column()
  userId: string;
  @Column()
  type: string;
  @Column()
  title: string;
  @Column({ type: 'text' })
  message: string;
  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, unknown>;
  @Column({ type: 'text' })
  errorMessage: string;
  @Column({ default: 0 })
  retryCount: number;
  @Column({ default: 'pending' })
  status: string;
  @CreateDateColumn()
  createdAt: Date;
}
