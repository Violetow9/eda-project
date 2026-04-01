'use client';

import { Task, TaskStatus } from '@/app/types/task';
import KanbanColumn from './KanbanColumn';

type KanbanBoardProps = {
  tasks: Task[];
  movingTaskId: number | null;
  deletingTaskId: number | null;
  onMove: (task: Task, nextStatus: TaskStatus) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
};

export default function KanbanBoard({
  tasks,
  movingTaskId,
  deletingTaskId,
  onMove,
  onDelete,
}: KanbanBoardProps) {
  const todoTasks = tasks.filter((task) => task.status === 'Todo');
  const inProgressTasks = tasks.filter((task) => task.status === 'In Progress');
  const doneTasks = tasks.filter((task) => task.status === 'Done');

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <KanbanColumn
        status="Todo"
        tasks={todoTasks}
        movingTaskId={movingTaskId}
        deletingTaskId={deletingTaskId}
        onMove={onMove}
        onDelete={onDelete}
      />
      <KanbanColumn
        status="In Progress"
        tasks={inProgressTasks}
        movingTaskId={movingTaskId}
        deletingTaskId={deletingTaskId}
        onMove={onMove}
        onDelete={onDelete}
      />
      <KanbanColumn
        status="Done"
        tasks={doneTasks}
        movingTaskId={movingTaskId}
        deletingTaskId={deletingTaskId}
        onMove={onMove}
        onDelete={onDelete}
      />
    </div>
  );
}