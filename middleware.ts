import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { getSessionFromCookies } from "@/shared/session/session.service";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/sign-in", "/sign-up", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  let sessionData;
  try {
    sessionData = await getSessionFromCookies();
  } catch (error) {
    console.error("Session extraction error:", error);
    return NextResponse.next();
  }

  const jwtToken = sessionData.session;
  const userId = sessionData.userId;

  let decodedToken;
  try {
    decodedToken = jwtDecode(jwtToken);
    console.debug("Successfully decoded token");
  } catch (error) {
    console.error("Failed to decode JWT", error);
    return NextResponse.next();
  }

  const exp = decodedToken.exp;
  const expDate = new Date(exp! * 1000);
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
