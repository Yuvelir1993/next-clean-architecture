import { Cookie } from "@/shared/cookie/cookie.schema";
import { Session } from "@/shared/session/session.schema";
import { cookies } from "next/headers";
import { AWS_COGNITO_SESSION_COOKIE_NAME } from "../constants";

export default async function setBrowserCookies(
  cookie: Cookie,
  session: Session,
  user: Pick<
    { email: string; password: string; username: string; id: string },
    "username" | "id"
  >
) {
  console.log(
    `Setting browser cookies for the session ${cookie.name} with value ${cookie.value}`
  );
  const cookieStore = await cookies();

  cookieStore.set(
    cookie.name,
    JSON.stringify({
      session: cookie.value,
      //   sessionAttributes: cookie.attributes,
      userId: user.id,
    }),
    {
      httpOnly: true, // Prevents JavaScript access (protects against XSS)
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 3600,
    }
  );
}

/**
 * Returns a Cookie representing an empty/invalidated session.
 * This function produces a value that conforms to your CookieSession type,
 * for example, using empty strings instead of nulls.
 */
export function getEmptySessionCookie(): Cookie {
  // Create an empty session object; adjust the fields as necessary
  const emptySession = {
    id: "",
    session: "",
    userId: "",
    userName: "",
    expiresAt: new Date(0), // a date in the past
  };

  return {
    name: AWS_COGNITO_SESSION_COOKIE_NAME,
    value: JSON.stringify(emptySession),
    attributes: {
      secure: true,
      path: "/",
      sameSite: "strict",
      httpOnly: true,
      maxAge: 3600,
      expires: new Date(Date.now() + 60 * 60 * 1000),
    },
  };
}
