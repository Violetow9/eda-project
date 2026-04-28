"use client";

import KanbanBoard from "@/app/components/task/KanbanBoard";
import TaskForm from "@/app/components/task/TaskForm";
import {fetchProjectById} from "@/app/lib/api/project-api";
import {socket} from "@/app/lib/socket";
import {Project} from "@/app/types/project";
import {Task, TaskStatus} from "@/app/types/task";
import Link from "next/link";
import {use, useEffect, useState} from "react";

import NotificationPanel from "@/app/components/notification/NotificationPanel";
import {createTask, deleteTask, fetchTasksByProject, moveTask} from "@/app/lib/api/task-api";
import { useAuth } from "@/app/components/auth/AuthProvider";

type ProjectPageProps = {
    params: Promise<{
        projectId: string;
    }>;
};

export default function ProjectDetailPage({params}: ProjectPageProps) {
    const { user, loading: authLoading, logout } = useAuth();

    const {projectId: projectIdParam} = use(params);
    const projectId = Number(projectIdParam);

    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [movingTaskId, setMovingTaskId] = useState<number | null>(null);
    const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [notificationRefreshSignal, setNotificationRefreshSignal] = useState(0);

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
                err instanceof Error ? err.message : "Erreur lors du chargement",
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (Number.isNaN(projectId)) {
            return;
        }

        loadData();

        console.log("connecting socket for project", projectId);

        socket.connect();

        socket.on("connect", () => {
            console.log("socket connected", socket.id);

            socket.emit("project.join", {
                projectId,
                userId: user?.id,
            });
        });

        function onTaskCreated(payload: { projectId: number; task: Task }) {
            if (payload.projectId !== projectId) {
                return;
            }

            setTasks((currentTasks) => {
                if (!payload.task) {
                    return currentTasks;
                }

                const alreadyExists = currentTasks.some(
                    (task) => task.id === payload.task.id,
                );

                if (alreadyExists) {
                    return currentTasks;
                }

                return [payload.task, ...currentTasks];
            });
            setNotificationRefreshSignal((current) => current + 1);
        }

        function onTaskMoved(payload: {
            projectId: number;
            taskId: number;
            from: string;
            to: string;
            movedBy?: string;
        }) {
            if (payload.projectId !== projectId) {
                return;
            }
            console.log(payload);
            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task.id === payload.taskId
                        ? {
                            ...task,
                            status: payload.to as TaskStatus,
                        }
                        : task,
                ),
            );
            setNotificationRefreshSignal((current) => current + 1);
        }


        function onTaskAssigned(payload: {
            projectId: number;
            taskId: number;
            assigneeUserId: string;
            title: string;
        }) {
            if (payload.projectId !== projectId) {
                return;
            }

            if (payload.assigneeUserId !== user?.id) {
                return;
            }

            setNotificationRefreshSignal((current) => current + 1);
        }

        function onTaskDeleted(payload: { projectId: number; taskId: number }) {
            if (payload.projectId !== projectId) {
                return;
            }

            setTasks((currentTasks) =>
                currentTasks.filter((task) => task.id !== payload.taskId),
            );
        }

        socket.on("task.created", onTaskCreated);
        socket.on("task.moved", onTaskMoved);
        socket.on("task.assigned", onTaskAssigned);
        socket.on("task.deleted", onTaskDeleted);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.on("connect_error", (error: any) => {
            console.error("socket connect_error", error);
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socket.on("disconnect", (reason: any) => {
            console.log("socket disconnected", reason);
        });

        return () => {
            socket.off("task.created", onTaskCreated);
            socket.off("task.moved", onTaskMoved);
            socket.off("task.assigned", onTaskAssigned);
            socket.off("task.deleted", onTaskDeleted);
            socket.off("connect");
            socket.off("connect_error");
            socket.off("disconnect");
            socket.disconnect();
        };
    }, [authLoading, projectId, user]);

    async function handleCreate(input: {
        title: string;
        assigneeUserId?: string | null;
    }) {
        try {
            setCreating(true);
            setError(null);

            const createdTask = await createTask(projectId, input);

            setTasks((current) => {
                const alreadyExists = current.some(
                    (task) => task.id === createdTask.id,
                );

                if (alreadyExists) {
                    return current;
                }

                return [createdTask, ...current];
            });
            setNotificationRefreshSignal((current) => current + 1);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Erreur lors de la création",
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
                current.map((item) =>
                    item.id === updatedTask.id ? updatedTask : item,
                ),
            );
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Erreur lors du déplacement",
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
                err instanceof Error ? err.message : "Erreur lors de la suppression",
            );
        } finally {
            setDeletingTaskId(null);
        }
    }

  if (authLoading || loading) {
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
                <div className="mx-auto text-black max-w-7xl">
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
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              href="/projects"
              className="mb-4 inline-block text-sm font-medium text-gray-600 hover:text-black"
            >
              ← Retour aux projets
            </Link>

            <h1 className="text-3xl font-bold">{project.projectName}</h1>
            <p className="mt-2 text-gray-600">Projet #{project.id}</p>
            {user && (
              <p className="mt-2 text-sm text-gray-600">
                Connecté : {user.email}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Se déconnecter
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <TaskForm onCreate={handleCreate} isCreating={creating} />
        <NotificationPanel
            userId={user?.id}
            userName={user?.email}
            projectId={projectId}
            refreshSignal={notificationRefreshSignal}
        />
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
