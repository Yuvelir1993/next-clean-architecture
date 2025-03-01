"use client";

import Link from "next/link";
import { signOutAction } from "@/app/dashboard/actions";
import { redirect } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const handleSignOut = async () => {
    await signOutAction();
    redirect("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Header (Shared Across All Pages) */}
      <header className="flex justify-between items-center bg-black shadow-md px-6 py-4">
        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-md bg-emerald-950 hover:bg-emerald-700 transition"
          >
            Create Project
          </Link>
        </div>

        <button
          className="px-4 py-2 rounded-md bg-red-950 text-white hover:bg-red-700 transition"
          onClick={handleSignOut}
        >
          Log Out
        </button>
      </header>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
