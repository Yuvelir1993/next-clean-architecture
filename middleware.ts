import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/sign-in", "/sign-up", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  const cookieSession = (await cookies()).get("session")?.value;

  if (isProtectedRoute && !cookieSession) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  const cookieUserId = (await cookies()).get("userId")?.value;
  const isPublicRoute = publicRoutes.includes(path);

  if (
    isPublicRoute &&
    cookieSession &&
    cookieUserId &&
    !req.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
