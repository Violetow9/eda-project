import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../domain/audit-log.entity';
import { AuditLogRepository } from '../domain/audit-log.repository.interface';
import { TypeOrmAuditLog } from './typeorm-audit-log.entity';

@Injectable()
export class TypeOrmAuditLogRepository implements AuditLogRepository {
  constructor(
    @InjectRepository(TypeOrmAuditLog)
    private readonly repository: Repository<TypeOrmAuditLog>,
  ) {}

  async create(auditLog: AuditLog): Promise<AuditLog> {
    const entity = this.repository.create({
      actorId: auditLog.actorId,
      action: auditLog.action,
      entityType: auditLog.entityType,
      entityId: auditLog.entityId,
      occurredAt: auditLog.occurredAt,
      metadata: auditLog.metadata,
    });

    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findAll(filters: {
    entityType?: string;
    entityId?: string;
    actorId?: string;
    action?: string;
  } = {}): Promise<AuditLog[]> {
    const logs = await this.repository.find({
      where: {
        ...(filters.entityType ? { entityType: filters.entityType } : {}),
        ...(filters.entityId ? { entityId: filters.entityId } : {}),
        ...(filters.actorId ? { actorId: filters.actorId } : {}),
        ...(filters.action ? { action: filters.action } : {}),
      },
      order: { occurredAt: 'DESC' },
    });

    return logs.map((log) => this.toDomain(log));
  }

  private toDomain(entity: TypeOrmAuditLog): AuditLog {
    return new AuditLog(
      entity.id,
      entity.actorId,
      entity.action,
      entity.entityType,
      entity.entityId,
      entity.occurredAt,
      entity.metadata ?? {},
    );
  }
}
