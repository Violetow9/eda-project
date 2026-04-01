export class ProjectCreatedEvent {
    constructor(
        readonly projectId: number,
        readonly projectName: string,
    ) {}
}
