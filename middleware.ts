import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookies } from "@/shared/session/session.service";
import { SessionValidationError } from "@/shared/session/session.errors";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/sign-in", "/sign-up", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  let sessionData;
  try {
    sessionData = await getSessionFromCookies();
  } catch (error) {
    if (error instanceof SessionValidationError) {
      console.error(
        `Was not able to parse current user's session! Error: '${error.message}'`
      );
    } else {
      console.error("Session extraction error:", error);
    }
    return NextResponse.next();
  }

  const userId = sessionData.userId;
  const expDate = sessionData.expiresAt;
  const currentDate = new Date();
  console.log(
    `Middleware - token expires at '${expDate}' (current time: '${currentDate}')`
  );

  if (publicRoutes.includes(path) && userId && currentDate < expDate) {
    console.log(`Current session is valid for the user '${userId}'.`);
    if (!req.nextUrl.pathname.startsWith("/dashboard")) {
      console.log("Redirecting to the dashboard...");
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  if (protectedRoutes.includes(path) && currentDate >= expDate) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
