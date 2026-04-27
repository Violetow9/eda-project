import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AUDIT_LOG_REPOSITORY } from './audit.constants';
import { AuditListener } from './application/audit.listener';
import { AuditService } from './application/audit.service';
import { TypeOrmAuditLog } from './infrastructure/typeorm-audit-log.entity';
import { TypeOrmAuditLogRepository } from './infrastructure/typeorm-audit-log.repository';
import { AuditController } from './presentation/audit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmAuditLog])],
  controllers: [AuditController],
  providers: [
    AuditService,
    AuditListener,
    {
      provide: AUDIT_LOG_REPOSITORY,
      useClass: TypeOrmAuditLogRepository,
    },
  ],
  exports: [AuditService],
})
export class AuditModule {}
