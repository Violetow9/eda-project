'use client';

import { FormEvent, useState } from 'react';

type ProjectFormProps = {
  onCreate: (input: { projectName: string }) => Promise<void>;
  isCreating: boolean;
};

export default function ProjectForm({
  onCreate,
  isCreating,
}: ProjectFormProps) {
  const [projectName, setProjectName] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!projectName.trim()) {
      return;
    }

    await onCreate({ projectName: projectName.trim() });
    setProjectName('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-2xl bg-white p-5 shadow-sm"
    >
      <h2 className="mb-4 text-black font-semibold">Créer un projet</h2>

      <div className="flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          placeholder="Nom du projet"
          value={projectName}
          onChange={(event) => setProjectName(event.target.value)}
          className="flex-1 rounded-lg border text-black border-gray-300 px-4 py-2 outline-none focus:border-black"
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