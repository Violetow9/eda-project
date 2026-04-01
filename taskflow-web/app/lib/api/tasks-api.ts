import { Task, TaskStatus } from '@/app/types/task';

export async function fetchTasksByProject(projectId: number): Promise<Task[]> {
    const res = await fetch(`/api/tasks/project/${projectId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
}

export async function createTask(
    projectId: number,
    input: { title: string; assigneeUserId?: string | null },
): Promise<Task> {
    const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...input, projectId }),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to create task');
    }
    return res.json();
}

export async function moveTask(taskId: number, status: TaskStatus): Promise<Task> {
    const res = await fetch(`/api/tasks/${taskId}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to move task');
    }
    return res.json();
}

export async function deleteTask(taskId: number): Promise<void> {
    const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to delete task');
    }
}
