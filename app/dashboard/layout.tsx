"use client";

import Link from "next/link";
import { signOutAction } from "@/app/dashboard/actions";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Header (Shared Across All Pages) */}
      <header className="flex justify-between items-center bg-black shadow-md px-6 py-4">
        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-500 transition"
          >
            Dashboard
          </Link>
          <Link
            href="/analytics"
            className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-500 transition"
          >
            Analytics
          </Link>
          <Link
            href="/settings"
            className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-500 transition"
          >
            Settings
          </Link>
        </div>

        {/* ✅ Logout Button (Right Side) */}
        <button
          className="px-4 py-2 rounded-md bg-red-950 text-white hover:bg-red-700 transition"
          onClick={() => {
            signOutAction();
            window.location.href = "/";
          }}
        >
          Log Out
        </button>
      </header>

      {/* ✅ Page Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
