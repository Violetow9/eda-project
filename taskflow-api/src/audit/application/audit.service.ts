import { Inject, Injectable } from '@nestjs/common';
import { AUDIT_LOG_REPOSITORY } from '../audit.constants';
import { AuditLog } from '../domain/audit-log.entity';
import type { AuditLogRepository } from '../domain/audit-log.repository.interface';

@Injectable()
export class AuditService {
  constructor(
    @Inject(AUDIT_LOG_REPOSITORY)
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  log(input: {
    actorId?: string;
    action: string;
    entityType: string;
    entityId: string | number;
    occurredAt?: Date;
    metadata?: Record<string, unknown>;
  }): Promise<AuditLog> {
    return this.auditLogRepository.create(
      new AuditLog(
        null,
        input.actorId ?? 'system',
        input.action,
        input.entityType,
        String(input.entityId),
        input.occurredAt ?? new Date(),
        input.metadata ?? {},
      ),
    );
  }

  findAll(filters?: {
    entityType?: string;
    entityId?: string;
    actorId?: string;
    action?: string;
  }): Promise<AuditLog[]> {
    return this.auditLogRepository.findAll(filters);
  }
}
