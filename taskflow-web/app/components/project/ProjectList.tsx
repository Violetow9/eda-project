'use client';

import Link from 'next/link';
import { Project } from '@/app/types/project';

type ProjectListProps = {
  projects: Project[];
};

export default function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-black">Aucun projet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {projects.map((project) => (
        <article
          key={project.id}
          className="rounded-2xl bg-white p-5 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            {project.projectName}
          </h3>
          <p className="mt-1 text-sm text-gray-500">ID: {project.id}</p>

          <Link
            href={`/projects/${project.id}`}
            className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Ouvrir le projet
          </Link>
        </article>
      ))}
    </div>
  );
}