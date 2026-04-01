export class ProjectCreatedEvent {
    constructor(private readonly name: string, private readonly description: string) {
    }
}