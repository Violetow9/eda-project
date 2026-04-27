'use client';

import { FormEvent, useState } from 'react';

type TaskFormProps = {
  onCreate: (input: {
    title: string;
    assigneeUserId?: string | null;
  }) => Promise<void>;
  isCreating: boolean;
};

export default function TaskForm({ onCreate, isCreating }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [assigneeUserId, setAssigneeUserId] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    await onCreate({
      title: title.trim(),
      assigneeUserId: assigneeUserId.trim() || null,
    });

    setTitle('');
    setAssigneeUserId('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-2xl bg-white p-5 shadow-sm"
    >
      <h2 className="text-black mb-4 text-xl font-semibold">Créer une tâche</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="Titre de la tâche"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="text-black rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
        />

        <input
          type="text"
          placeholder="Assignee user id (optionnel)"
          value={assigneeUserId}
          onChange={(event) => setAssigneeUserId(event.target.value)}
          className="text-black rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-black"
        />

        <button
          type="submit"
          disabled={isCreating}
          className="rounded-lg bg-black px-4 py-2 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCreating ? 'Création...' : 'Créer'}
        </button>
      </div>
    </form>
  );
}