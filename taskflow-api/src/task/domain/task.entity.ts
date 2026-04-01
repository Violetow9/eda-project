type TaskStatusValue = 'Todo' | 'In Progress' | 'Done';

const VALID_TRANSITIONS: Record<TaskStatusValue, TaskStatusValue[]> = {
    'Todo': ['In Progress'],
    'In Progress': ['Done'],
    'Done': [],
};

export class TaskStatus {
    static readonly TODO = new TaskStatus('Todo');
    static readonly IN_PROGRESS = new TaskStatus('In Progress');
    static readonly DONE = new TaskStatus('Done');

    private constructor(readonly value: TaskStatusValue) {
    }

    static from(value: string): TaskStatus {
        switch (value) {
            case 'Todo':
                return TaskStatus.TODO;
            case 'In Progress':
                return TaskStatus.IN_PROGRESS;
            case 'Done':
                return TaskStatus.DONE;
            default:
                throw new Error(`Invalid task status: "${value}"`);
        }
    }

    moveTo(next: TaskStatus): TaskStatus {
        if (!VALID_TRANSITIONS[this.value].includes(next.value)) {
            throw new Error(`Cannot transition from "${this.value}" to "${next.value}"`);
        }
        return next;
    }

    toString(): string {
        return this.value;
    }
}

interface TaskConstructorParams {
    id: number;
    title: string;
    status: TaskStatus;
    projectId: number;
    assigneeUserId?: string | null;
}

export class Task {
    readonly id: number;
    readonly title: string;
    readonly status: TaskStatus;
    readonly projectId: number;
    readonly assigneeUserId: string | null;

    constructor({id, title, status, projectId, assigneeUserId = null}: TaskConstructorParams) {
        if (!title || title.trim().length === 0) {
            throw new Error('Task title cannot be empty');
        }
        this.id = id;
        this.title = title.trim();
        this.status = status;
        this.projectId = projectId;
        this.assigneeUserId = assigneeUserId ?? null;
    }

    move(newStatus: TaskStatus): Task {
        const next = this.status.moveTo(newStatus);
        return new Task({
            id: this.id,
            title: this.title,
            status: next,
            projectId: this.projectId,
            assigneeUserId: this.assigneeUserId,
        });
    }
}
