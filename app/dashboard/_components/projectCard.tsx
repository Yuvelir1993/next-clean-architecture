"use client";

import { ProjectUiDTO } from "@/src/adapters/dto/aggregates/project.dto";
import React from "react";
import { Delete } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/state/hooks";
import { deleteProject } from "@/app/state/projectsSlice";

interface ProjectCardProps {
  project: ProjectUiDTO;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.projects);

  const handleDelete = () => {
    dispatch(deleteProject(project.id));
  };

  return (
    <div className="relative bg-stone-200 rounded-lg shadow-md p-6 max-w-sm">
      {/* show any deletion error */}
      {error && (
        <div className="absolute top-2 left-2 text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleDelete}
        aria-label="Delete project"
        className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-600 transition-colors"
        disabled={loading}
      >
        <Delete size={20} color="red" />
      </button>

      <h2 className="text-emerald-700 text-2xl font-semibold mb-2">
        {project.name}
      </h2>
      <p className="text-gray-700 mb-4">
        {project.description || "No description provided."}
      </p>
      <a
        href={project.githubRepoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        View GitHub Repository
      </a>
    </div>
  );
};

export default ProjectCard;
