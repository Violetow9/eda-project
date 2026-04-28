import { AuditLog } from './audit-log.entity';

export interface AuditLogRepository {
  create(auditLog: AuditLog): Promise<AuditLog>;
  findAll(filters?: {
    entityType?: string;
    entityId?: string;
    actorId?: string;
    action?: string;
  }): Promise<AuditLog[]>;
}
