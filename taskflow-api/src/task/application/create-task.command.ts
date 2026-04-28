export interface CreateTaskCommand {
    readonly title: string;
    readonly projectId: number;
    readonly assigneeUserId?: string | null;
}
