"use client";

import React from "react";
import { CreateProjectFormErrors } from "@/app/lib/definitions";

interface UIErrorCreateProjectProps {
  errors: CreateProjectFormErrors;
}

function isErrorObject(errors: CreateProjectFormErrors): errors is {
  projectName?: string[];
  repoLink?: string[];
  description?: string[];
} {
  return !Array.isArray(errors);
}

const UIErrorCreateProject: React.FC<UIErrorCreateProjectProps> = ({
  errors,
}) => {
  if (
    Array.isArray(errors) &&
    errors.every((error) => typeof error === "string")
  ) {
    return (
      <ul>
        {errors.map((error, index) => (
          <li className="text-red-500" key={index}>
            {error}
          </li>
        ))}
      </ul>
    );
  }

  if (isErrorObject(errors)) {
    return (
      <ul>
        {errors.projectName && (
          <li className="bg-red-100 text-red-800 p-4 rounded-md">
            Project Name errors: {errors.projectName.join(", ")}
          </li>
        )}
        {errors.repoLink && (
          <li className="bg-red-100 text-red-800 p-4 rounded-md">
            Repo Link errors: {errors.repoLink.join(", ")}
          </li>
        )}
        {errors.description && (
          <li className="bg-red-100 text-red-800 p-4 rounded-md">
            Description errors: {errors.description.join(", ")}
          </li>
        )}
      </ul>
    );
  }

  return null;
};

export default UIErrorCreateProject;
