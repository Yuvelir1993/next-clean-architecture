import React from "react";

interface ErrorRetrieveProjectsProps {
  title?: string;
  message?: string;
}

const ErrorRetrieveProjects: React.FC<ErrorRetrieveProjectsProps> = ({
  title = "No Projects Found",
  message = "You haven't created any projects yet. Please create a new project to get started.",
}) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-800">
      <div className="text-center p-6">
        <h2 className="text-3xl font-bold text-orange-400">{title}</h2>
        <p className="mt-2 text-gray-50">{message}</p>
      </div>
    </div>
  );
};

export default ErrorRetrieveProjects;
