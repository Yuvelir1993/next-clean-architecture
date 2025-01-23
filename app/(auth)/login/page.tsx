export default function Login() {
  return (
    <div className="grid min-h-screen place-items-center p-8 sm:p-20">
      <main className="flex flex-col gap-6 items-center w-full max-w-sm">
        <h1 className="text-2xl sm:text-4xl font-semibold">
          Login to Project Hub
        </h1>

        <form className="flex flex-col w-full gap-4">
          <label className="flex flex-col">
            <span className="font-medium">Email</span>
            <input
              className="border border-black/20 dark:border-white/20 rounded p-2 text-black dark:text-white"
              type="email"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="font-medium">Password</span>
            <input
              className="border border-black/20 dark:border-white/20 rounded p-2 text-black dark:text-white"
              type="password"
              required
            />
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
