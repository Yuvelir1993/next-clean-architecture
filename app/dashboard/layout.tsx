"use client";

import React, { useState } from "react";
import { signOutAction } from "@/app/dashboard/actions";
import { redirect } from "next/navigation";
import CreateProject from "@/app/dashboard/_components/CreateProject";
import { createProjectAction } from "@/app/dashboard/actions";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showCreateProject, setShowCreateProject] = useState(false);

  const handleSignOut = async () => {
    await signOutAction();
    redirect("/");
  };

  const openCreateProject = () => {
    setShowCreateProject(true);
  };

  const closeCreateProject = () => {
    setShowCreateProject(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* ✅ Header (Shared Across All Pages) */}
      <header className="flex justify-between items-center bg-black shadow-md px-6 py-4">
        <div className="flex gap-4">
          <button
            onClick={openCreateProject}
            className="px-4 py-2 rounded-md bg-emerald-950 hover:bg-emerald-700 transition"
          >
            Create Project
          </button>
        </div>

        <button
          className="px-4 py-2 rounded-md bg-red-950 text-white hover:bg-red-700 transition"
          onClick={handleSignOut}
        >
          Log Out
        </button>
      </header>

      <main className="flex-1 p-6">{children}</main>

      {showCreateProject && (
        <CreateProject
          onClose={closeCreateProject}
          createProjectAction={createProjectAction}
        />
      )}
    </div>
  );
}
