import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from '../application/audit.service';

@Controller({ path: 'audit-logs', version: '1' })
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll(
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('actorId') actorId?: string,
    @Query('action') action?: string,
  ) {
    return this.auditService.findAll({ entityType, entityId, actorId, action });
  }
}
