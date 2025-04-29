import React from "react";

interface SpinnerProps {
  label?: string;
}

export default function Spinner({ label }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-4 border-emerald-600 border-t-transparent"></div>
      {label && <p className="mt-3 text-sm text-gray-500">{label}</p>}
    </div>
  );
}
