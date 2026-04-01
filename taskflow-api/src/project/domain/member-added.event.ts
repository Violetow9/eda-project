export class MemberAddedEvent {
    constructor(
        readonly projectId: number,
        readonly userId: string,
    ) {}
}
