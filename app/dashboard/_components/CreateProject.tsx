"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/state/hooks";
import { createProject } from "@/app/state/projectsSlice";
import UIErrorCreateProject from "@/app/dashboard/_components/errors/ErrorCreateProject";

interface CreateProjectProps {
  onClose: () => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.projects);

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [repoLink, setRepoLink] = useState("");

  const handleCreateProjectSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("projectName", projectName);
    formData.append("description", description);
    formData.append("repoLink", repoLink);

    dispatch(createProject(formData))
      .unwrap()
      .then(() => onClose())
      .catch(() => {});
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-slate-700 text-2xl font-bold mb-4">
          Create Project
        </h2>

        {error && <UIErrorCreateProject errors={[error]} />}

        <form onSubmit={handleCreateProjectSubmit}>
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <div className="text-slate-700 flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
