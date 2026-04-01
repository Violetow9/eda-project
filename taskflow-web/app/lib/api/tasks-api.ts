import { Task, TaskStatus } from '@/app/types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function fetchTasksByProject(projectId: number): Promise<Task[]> {
  const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return response.json();
}

export async function createTask(projectId: number, input: {
  title: string;
  assigneeUserId?: string | null;
}): Promise<Task> {
  const response = await fetch(`${API_URL}/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to create task');
  }

  return response.json();
}

export async function moveTask(taskId: number, status: TaskStatus): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${taskId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to move task');
  }

  return response.json();
}

export async function deleteTask(taskId: number): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to delete task');
  }
}