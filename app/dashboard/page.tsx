import React from "react";
import ProjectCard from "@/app/dashboard/_components/projectCard";
import { getProjects } from "@/app/dashboard/actions";
import ErrorRetrieveProjects from "@/app/dashboard/_components/errors/ErrorRetrieveProjects";

export default async function Dashboard() {
  const projects = await getProjects();

  if (projects.length === 0) {
    return <ErrorRetrieveProjects />;
  }

  return (
    <div className="min-h-[80vh] p-6 ">
      <div className="flex flex-wrap gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
