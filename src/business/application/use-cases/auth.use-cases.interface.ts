import { Session } from "@/shared/session/session.schema";
import { Cookie } from "@/shared/cookie/cookie.schema";
import { User } from "@/src/business/domain/entities/user";

export interface IAuthenticationUseCases {
  /**
   * Sign in an existing user.
   *
   * @param input - An object containing the user's email and password.
   * @returns A Promise resolving to an object with a session and cookie.
   */
  signIn(input: { email: string; password: string }): Promise<{
    user: Pick<User, "id" | "email" | "username">;
    session: Session;
    cookie: Cookie;
  }>;

  /**
   * Sign out a user by invalidating their session.
   *
   * @param sessionId - The session identifier to invalidate.
   * @returns A Promise resolving to an object with a blank cookie.
   */
  signOut(sessionId: string): Promise<{ blankCookie: Cookie }>;

  /**
   * Sign up a new user.
   *
   * @param input - An object containing the new user's username and password.
   * @returns A Promise resolving to an object with a session, cookie, and a user object containing only safe info without any passwords.
   */
  signUp(input: { username: string; password: string }): Promise<{
    user: Pick<User, "id" | "email" | "username">;
    session: Session;
    cookie: Cookie;
  }>;
}
