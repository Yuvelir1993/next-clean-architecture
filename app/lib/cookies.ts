import { Cookie } from "@/src/business/entities/models/cookie";
import { Session } from "@/src/business/entities/models/session";
import { cookies } from "next/headers";

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
