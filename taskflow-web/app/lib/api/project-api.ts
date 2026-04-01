import { Project } from '@/app/types/project';

export async function fetchProjects(): Promise<Project[]> {
    const res = await fetch('/api/projects', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
}

export async function fetchProjectById(projectId: number): Promise<Project> {
    const res = await fetch(`/api/projects/${projectId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch project');
    return res.json();
}

export async function createProject(input: { projectName: string }): Promise<Project> {
    const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to create project');
    }
    return res.json();
}

export async function deleteProject(projectId: number): Promise<void> {
    const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to delete project');
    }
}
