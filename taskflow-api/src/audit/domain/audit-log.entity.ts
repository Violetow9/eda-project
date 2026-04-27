export class AuditLog {
  constructor(
    readonly id: number | null,
    readonly actorId: string,
    readonly action: string,
    readonly entityType: string,
    readonly entityId: string,
    readonly occurredAt: Date,
    readonly metadata: Record<string, unknown> = {},
  ) {}
}
