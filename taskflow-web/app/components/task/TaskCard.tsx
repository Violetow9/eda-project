'use client';

import { Task, TaskStatus } from "@/app/types/task";

type TaskCardProps = {
  task: Task;
  onMove: (task: Task, nextStatus: TaskStatus) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
  isMoving: boolean;
  isDeleting: boolean;
};

function getNextStatus(status: TaskStatus): TaskStatus | null {
  if (status === 'Todo') return 'In Progress';
  if (status === 'In Progress') return 'Done';
  return null;
}

function getMoveLabel(status: TaskStatus): string | null {
  if (status === 'Todo') return 'Passer en In Progress';
  if (status === 'In Progress') return 'Passer en Done';
  return null;
}

export default function TaskCard({
  task,
  onMove,
  onDelete,
  isMoving,
  isDeleting,
}: TaskCardProps) {
  const nextStatus = getNextStatus(task.status);
  const moveLabel = getMoveLabel(task.status);

  return (
    <article className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-gray-900">{task.title}</h3>
        <p className="mt-1 text-sm text-gray-500">ID: {task.id}</p>
        {task.assigneeUserId && (
          <p className="mt-1 text-sm text-gray-500">
            Assigné à : {task.assigneeUserId}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {nextStatus && moveLabel ? (
          <button
            type="button"
            onClick={() => onMove(task, nextStatus)}
            disabled={isMoving || isDeleting}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isMoving ? 'Déplacement...' : moveLabel}
          </button>
        ) : (
          <span className="inline-block rounded-lg bg-green-100 px-3 py-2 text-sm font-medium text-green-700">
            Terminée
          </span>
        )}

        <button
          type="button"
          onClick={() => onDelete(task.id)}
          disabled={isDeleting || isMoving}
          className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? 'Suppression...' : 'Supprimer'}
        </button>
      </div>
    </article>
  );
}