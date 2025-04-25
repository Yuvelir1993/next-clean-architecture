"use client";

import React, { useEffect } from "react";
import ProjectCard from "@/app/dashboard/_components/projectCard";
import ErrorRetrieveProjects from "@/app/dashboard/_components/errors/ErrorRetrieveProjects";
import { getProjects } from "@/app/state/projectsSlice";
import { useAppDispatch, useAppSelector } from "@/app/state/hooks";
import Spinner from "@/app/dashboard/_components/Spinner";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector(
    (state) => state.projects
  );

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Spinner label="Loading projects…" />
      </div>
    );
  }

  if (error) return <ErrorRetrieveProjects />;

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
