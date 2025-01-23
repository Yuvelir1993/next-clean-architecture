import Link from "next/link";

export default function Home() {
  return (
    <div className="grid min-h-screen place-items-center p-8 sm:p-20">
      <main className="flex flex-col gap-6 items-center">
        <h1 className="text-2xl sm:text-4xl font-semibold">
          Welcome to project hub!
        </h1>

        <div className="flex gap-4">
          <Link
            className="rounded-full border border-solid border-transparent 
                       bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] 
                       transition-colors text-sm sm:text-base h-10 px-4 flex items-center justify-center"
            href="login"
          >
            Login
          </Link>

          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] 
                       hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent 
                       transition-colors text-sm sm:text-base h-10 px-4 flex items-center justify-center"
            href="signup"
          >
            Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
}
