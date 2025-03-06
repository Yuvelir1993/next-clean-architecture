"use client";

import { ProjectDTO } from "@/app/lib/dto/aggregates/project.dto";
import React from "react";

interface ProjectCardProps {
  project: ProjectDTO;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-stone-200 rounded-lg shadow-md p-6 max-w-sm">
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
