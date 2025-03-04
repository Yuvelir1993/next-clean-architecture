"use client";

import { Input } from "@/app/(auth)/_components/input";
import { useActionState } from "react";
import { signInAction } from "@/app/(auth)/actions";
import UIErrorAuth from "@/app/(auth)/_components/errors/ErrorsAuth";

export default function SignInForm() {
  const [state, formAction, pending] = useActionState(signInAction, undefined);

  return (
    <div className="grid min-h-screen place-items-center p-8 sm:p-20">
      <main className="flex flex-col gap-6 items-center w-full max-w-sm">
        <h1 className="text-2xl sm:text-4xl font-semibold">
          Login to Project Hub
        </h1>

        <form className="flex flex-col w-full gap-4" action={formAction}>
          <label className="flex flex-col">
            <span className="font-medium">Email</span>
            <Input id="email" type="email" name="email" required />
          </label>

          <label className="flex flex-col">
            <span className="font-medium">Password</span>
            <Input id="password" type="password" name="password" required />
          </label>

          {state?.errors && <UIErrorAuth errors={state.errors} />}

          <button
            disabled={pending}
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
          <a href="/sign-up" className="underline hover:no-underline">
            Sign up
          </a>
        </div>
      </main>
    </div>
  );
}
