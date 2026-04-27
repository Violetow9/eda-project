import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('audit_logs')
export class TypeOrmAuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  actorId: string;

  @Column()
  action: string;

  @Column()
  entityType: string;

  @Column()
  entityId: string;

  @Column({ type: 'timestamp' })
  occurredAt: Date;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, unknown>;
}
