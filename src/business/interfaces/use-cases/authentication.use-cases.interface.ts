import { Session } from "@/src/business/entities/models/session";
import { Cookie } from "@/src/business/entities/models/cookie";
import { User } from "@/src/business/entities/models/user";

export interface IAuthenticationUseCases {
  /**
   * Sign in an existing user.
   *
   * @param input - An object containing the user's email and password.
   * @returns A Promise resolving to an object with a session and cookie.
   */
  signIn(input: {
    email: string;
    password: string;
  }): Promise<{ session: Session; cookie: Cookie }>;

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
   * @returns A Promise resolving to an object with a session, cookie, and a user object containing the id and username.
   */
  signUp(input: { username: string; password: string }): Promise<{
    session: Session;
    cookie: Cookie;
    user: Pick<User, "id" | "username">;
  }>;
}
