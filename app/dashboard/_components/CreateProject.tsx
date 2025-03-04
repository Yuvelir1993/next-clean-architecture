"use client";

import React, { useState } from "react";
import { useActionState } from "react"; // Adjust import if needed
import { createProjectAction } from "@/app/dashboard/actions";
import UIErrorCreateProject from "@/app/dashboard/_components/errors/ErrorCreateProject";

interface CreateProjectProps {
  onClose: () => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({ onClose }) => {
  const [state, formAction, pending] = useActionState(
    createProjectAction,
    undefined
  );
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [repoLink, setRepoLink] = useState("");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-slate-700 text-2xl font-bold mb-4">
          Create Project
        </h2>
        {state?.errors && <UIErrorCreateProject errors={state.errors} />}
        <form action={formAction}>
          <div className="mb-4">
            <label
              htmlFor="projectName"
              className="text-slate-700 block text-sm font-medium mb-1"
            >
              Project Name
            </label>
            <input
              id="projectName"
              name="projectName"
              type="text"
              className="text-slate-700 w-full border rounded px-3 py-2"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="text-slate-700 block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="text-slate-700 w-full border rounded px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="repoLink"
              className="text-slate-700 block text-sm font-medium mb-1"
            >
              GitHub Repo Link
            </label>
            <input
              id="repoLink"
              name="repoLink"
              type="url"
              className="text-slate-700 w-full border rounded px-3 py-2"
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
              required
            />
          </div>
          <div className="text-slate-700 flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              onClick={onClose}
              disabled={pending}
            >
              Cancel
            </button>
            <button
              type={state?.message ? "button" : "submit"}
              className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
              disabled={pending}
              onClick={state?.message ? onClose : undefined}
            >
              {pending ? "Creating..." : state?.message ? "Created!" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
