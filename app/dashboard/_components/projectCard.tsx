"use client";

import React from "react";

export interface Project {
  projectId: string;
  projectName: string;
  projectOwner: string;
  description?: string;
  repoLink: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-slate-100 rounded-lg shadow-md p-6 max-w-sm">
      <h2 className="text-emerald-700 text-2xl font-semibold mb-2">
        {project.projectName}
      </h2>
      <p className="text-gray-700 mb-4">
        {project.description || "No description provided."}
      </p>
      <a
        href={project.repoLink}
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
