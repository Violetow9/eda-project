interface ProjectConstructorParams {
    id: number;
    projectName: string;
    members?: string[];
}

export class Project {
    readonly id: number;
    readonly projectName: string;
    readonly members: string[];

    constructor({ id, projectName, members = [] }: ProjectConstructorParams) {
        if (!projectName || projectName.trim().length === 0) {
            throw new Error('Project name cannot be empty');
        }
        this.id = id;
        this.projectName = projectName.trim();
        this.members = [...members];
    }

    addMember(userId: string): Project {
        if (this.members.includes(userId)) {
            throw new Error(`User ${userId} is already a member of this project`);
        }
        return new Project({
            id: this.id,
            projectName: this.projectName,
            members: [...this.members, userId],
        });
    }
}
