"use client";
import { useState } from "react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-md transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } md:relative md:translate-x-0`}
      >
        <div className="p-4 text-xl font-bold">Dashboard</div>
        <nav className="mt-6">
          <a
            href="#"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            Home
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            Analytics
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            Settings
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Navbar */}
        <header className="flex items-center justify-between bg-white p-4 shadow-md">
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">John Doe</span>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800">Overview</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="text-lg font-medium">Total Users</h3>
              <p className="text-3xl font-bold">1,250</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="text-lg font-medium">Revenue</h3>
              <p className="text-3xl font-bold">$24,980</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="text-lg font-medium">New Signups</h3>
              <p className="text-3xl font-bold">340</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
