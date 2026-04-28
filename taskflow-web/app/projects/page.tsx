'use client';

import { useEffect, useState } from 'react';
import ProjectForm from '../components/project/ProjectForm';
import ProjectList from '../components/project/ProjectList';
import { fetchProjects, createProject } from '../lib/api/project-api';
import { Project } from '../types/project';
import { useAuth } from '../components/auth/AuthProvider';


export default function ProjectsPage() {
  const { user, loading: authLoading, logout } = useAuth();

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
    if (!authLoading && user) {
      loadProjects();
    }
  }, [authLoading, user]);

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

  if (authLoading || loading) {
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
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl text-black font-bold">Projects</h1>
            <p className="mt-2 text-black">
              Démonstration simple du module Project et Task
            </p>
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