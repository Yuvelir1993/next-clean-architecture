"use client";

import React from "react";
import ProjectCard, { Project } from "@/app/dashboard/_components/ProjectCard";

export default function Dashboard() {
  const dummyProjects: Project[] = [
    {
      projectId: "project-123",
      projectName: "My Awesome Project",
      projectOwner: "Me",
      description: "This is a description of my awesome project.",
      repoLink: "https://github.com/username/my-awesome-project",
    },
    {
      projectId: "project-124",
      projectName: "Second Project",
      projectOwner: "You",
      description: "This is a description of the second project.",
      repoLink: "https://github.com/username/second-project",
    },
    {
      projectId: "project-125",
      projectName: "Third Project",
      projectOwner: "Us",
      description: "This is a description of the third project.",
      repoLink: "https://github.com/username/third-project",
    },
    {
      projectId: "project-126",
      projectName: "Fourth Project",
      projectOwner: "Them",
      description: "This is a description of the fourth project.",
      repoLink: "https://github.com/username/fourth-project",
    },
  ];

  return (
    <div className="min-h-[80vh] p-6 ">
      <div className="flex flex-wrap gap-4">
        {dummyProjects.map((project) => (
          <ProjectCard key={project.projectId} project={project} />
        ))}
      </div>
    </div>
  );
}
