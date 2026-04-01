'use client';

import KanbanBoard from '@/app/components/task/KanbanBoard';
import TaskForm from '@/app/components/task/TaskForm';
import { fetchProjectById } from '@/app/lib/api/project-api';
import { fetchTasksByProject, createTask, moveTask, deleteTask } from '@/app/lib/api/tasks-api';
import { Project } from '@/app/types/project';
import { Task, TaskStatus } from '@/app/types/task';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';

type ProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default function ProjectDetailPage({ params }: ProjectPageProps) {
  const { projectId: projectIdParam } = use(params);
  const projectId = Number(projectIdParam);

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [movingTaskId, setMovingTaskId] = useState<number | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const [projectData, tasksData] = await Promise.all([
        fetchProjectById(projectId),
        fetchTasksByProject(projectId),
      ]);

      setProject(projectData);
      setTasks(tasksData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors du chargement',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!Number.isNaN(projectId)) {
      loadData();
    }
  }, [projectId]);

  async function handleCreate(input: {
    title: string;
    assigneeUserId?: string | null;
  }) {
    try {
      setCreating(true);
      setError(null);

      const createdTask = await createTask(projectId, input);
      setTasks((current) => [createdTask, ...current]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors de la création',
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleMove(task: Task, nextStatus: TaskStatus) {
    try {
      setMovingTaskId(task.id);
      setError(null);

      const updatedTask = await moveTask(task.id, nextStatus);

      setTasks((current) =>
        current.map((item) => (item.id === updatedTask.id ? updatedTask : item)),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors du déplacement',
      );
    } finally {
      setMovingTaskId(null);
    }
  }

  async function handleDelete(taskId: number) {
    try {
      setDeletingTaskId(taskId);
      setError(null);

      await deleteTask(taskId);
      setTasks((current) => current.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors de la suppression',
      );
    } finally {
      setDeletingTaskId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-7xl">
          <p>Chargement du projet...</p>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto text-black  max-w-7xl">
          <p className="text-4xl">Projet introuvable.</p>
          <Link
            href="/projects"
            className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-white"
          >
            Retour aux projets
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/projects"
            className="mb-4 inline-block text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Retour aux projets
          </Link>

          <h1 className="text-3xl font-bold">{project.projectName}</h1>
          <p className="mt-2 text-gray-600">Projet #{project.id}</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <TaskForm onCreate={handleCreate} isCreating={creating} />

        <KanbanBoard
          tasks={tasks}
          movingTaskId={movingTaskId}
          deletingTaskId={deletingTaskId}
          onMove={handleMove}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}