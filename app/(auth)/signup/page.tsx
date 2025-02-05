"use client";

import { useActionState } from "react";
import { signUpAction } from "@/app/(auth)/actions";
import { Input } from "@/app/(auth)/_components/input";

export default function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUpAction, undefined);

  return (
    <div className="grid min-h-screen place-items-center p-8 sm:p-20">
      <main className="flex flex-col gap-6 items-center w-full max-w-sm">
        <h1 className="text-2xl sm:text-4xl font-semibold">
          Create an Account
        </h1>

        <form className="flex flex-col w-full gap-4" action={formAction}>
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
          {state?.errors &&
            !Array.isArray(state.errors) &&
            state.errors.name && <p>{state.errors.name.join(", ")}</p>}

          <label className="flex flex-col">
            <span className="font-medium">Email</span>
            <Input id="email" type="email" name="email" required />
          </label>
          {state?.errors &&
            !Array.isArray(state.errors) &&
            state.errors.email && <p>{state.errors.email.join(", ")}</p>}

          <label className="flex flex-col">
            <span className="font-medium">Password</span>
            <Input id="password" type="password" name="password" required />
          </label>

          {state?.errors &&
            !Array.isArray(state.errors) &&
            state.errors.password && (
              <div>
                <p>Password must:</p>
                <ul>
                  {state.errors.password.map((error) => (
                    <li key={error}>- {error}</li>
                  ))}
                </ul>
              </div>
            )}

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
            disabled={pending}
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
