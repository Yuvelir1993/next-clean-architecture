"use client";

import { Input } from "../_components/input";
import { useState } from "react";
import { signInAction } from "../actions";

export default function Login() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const formData = new FormData(event.currentTarget);

    console.log(formData);

    setLoading(true);
    const res = await signInAction(formData);

    if (res && res.error) {
      setError(res.error);
    }
    if (res && res.error) {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="grid min-h-screen place-items-center p-8 sm:p-20">
      <main className="flex flex-col gap-6 items-center w-full max-w-sm">
        <h1 className="text-2xl sm:text-4xl font-semibold">
          Login to Project Hub
        </h1>

        <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
          {error && <p className="text-destructive">{error}</p>}
          <label className="flex flex-col">
            <span className="font-medium">Email</span>
            <Input id="email" type="email" name="email" required />
          </label>

          <label className="flex flex-col">
            <span className="font-medium">Password</span>
            <Input id="password" type="password" name="password" required />
          </label>

          <button
            type="submit"
            className="mt-2 rounded-full border border-transparent 
                         bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] 
                         transition-colors text-sm sm:text-base h-10 px-4"
          >
            Login
          </button>
        </form>

        <div className="text-sm">
          Don’t have an account?{" "}
          <a href="/signup" className="underline hover:no-underline">
            Sign up
          </a>
        </div>
      </main>
    </div>
  );
}
