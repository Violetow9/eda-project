'use client';

import { Task, TaskStatus } from '@/app/types/task';
import TaskCard from './TaskCard';

type KanbanColumnProps = {
  status: TaskStatus;
  tasks: Task[];
  movingTaskId: number | null;
  deletingTaskId: number | null;
  onMove: (task: Task, nextStatus: TaskStatus) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
};

export default function KanbanColumn({
  status,
  tasks,
  movingTaskId,
  deletingTaskId,
  onMove,
  onDelete,
}: KanbanColumnProps) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-black">{status}</h2>
        <span className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 text-black">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 text-black">
            Aucune tâche
          </div>
        )}

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onMove={onMove}
            onDelete={onDelete}
            isMoving={movingTaskId === task.id}
            isDeleting={deletingTaskId === task.id}
          />
        ))}
      </div>
    </section>
  );
}