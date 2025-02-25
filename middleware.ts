import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/sign-in", "/sign-up", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const extractedCookies = await cookies();

  console.log(`Obtained cookies ${extractedCookies}`);
  const sessionCookie = extractedCookies.get("AwsCognitoSession")?.value;

  console.log(`Obtained session value ${sessionCookie}`);

  if (!sessionCookie) {
    return NextResponse.next();
  }

  if (protectedRoutes.includes(path) && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  let parsedSession;
  try {
    parsedSession = JSON.parse(sessionCookie);
  } catch (error) {
    console.error("Failed to parse session cookie", error);
    return NextResponse.next();
  }

  if (!parsedSession.session) {
    console.error("No valid session token available");
    return NextResponse.next();
  }

  const jwtToken = parsedSession.session;
  const userId = parsedSession.userId;

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

  // For public routes: if user is logged in, valid, and not expired, redirect to dashboard.
  if (
    publicRoutes.includes(path) &&
    sessionCookie &&
    userId &&
    currentDate < expDate
  ) {
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
