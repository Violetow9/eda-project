export interface CreateProjectCommand {
  readonly projectName: string;
  readonly creatorId: string;
  readonly actorId?: string;
}
