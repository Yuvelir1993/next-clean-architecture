"use client";

import { useState } from "react";
import { signUp } from "../actions";
import { Input } from "../_components/input";

export default function SignUp() {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const formData = new FormData(event.currentTarget);

    console.log(formData);

    const password = formData.get("password")!.toString();
    const confirmPassword = formData.get("confirm_password")!.toString();

    if (password !== confirmPassword) {
      setError("Passwords must match");
      return;
    }

    setLoading(true);
    const res = await signUp(formData);

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
          Create an Account
        </h1>
        {error && <p className="text-destructive">{error}</p>}
        <form className="flex flex-col w-full gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col">
            <span className="font-medium">Username</span>
            <Input
              id="username"
              type="text"
              name="username"
              placeholder="plozovikov"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="font-medium">Email</span>
            <Input id="email" type="email" name="email" required />
          </label>

          <label className="flex flex-col">
            <span className="font-medium">Password</span>
            <Input id="password" type="password" name="password" required />
          </label>

          <label className="flex flex-col">
            <span className="font-medium">Confirm password</span>
            <Input
              id="confirm_password"
              type="password"
              name="confirm_password"
              required
            />
          </label>

          <button
            type="submit"
            className="mt-2 rounded-full border border-transparent 
                         bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] 
                         transition-colors text-sm sm:text-base h-10 px-4"
          >
            Sign Up
          </button>
        </form>

        <div className="text-sm">
          Already have an account?{" "}
          <a href="/login" className="underline hover:no-underline">
            Log in
          </a>
        </div>
      </main>
    </div>
  );
}
