'use client';

import { useEffect, useState } from 'react';
import ProjectForm from '../components/project/ProjectForm';
import ProjectList from '../components/project/ProjectList';
import { fetchProjects, createProject } from '../lib/api/project-api';
import { Project } from '../types/project';


export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadProjects() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors du chargement',
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleCreate(input: { projectName: string }) {
    try {
      setCreating(true);
      setError(null);

      const createdProject = await createProject(input);
      setProjects((current) => [createdProject, ...current]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors de la création',
      );
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-4 text-3xl font-bold">Projects</h1>
          <p>Chargement des projets...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl text-black font-bold">Projects</h1>
          <p className="mt-2 text-black">
            Démonstration simple du module Project et Task
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <ProjectForm onCreate={handleCreate} isCreating={creating} />
        <ProjectList projects={projects} />
      </div>
    </main>
  );
}