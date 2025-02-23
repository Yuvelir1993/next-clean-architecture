import { Cookie } from "@/src/business/entities/models/cookie";
import { Session } from "@/src/business/entities/models/session";
import {
  SignInUser,
  SignUpUser,
  User,
} from "@/src/business/entities/models/user";

export interface IAuthenticationService {
  validateSession(sessionId: Session["id"]): Promise<boolean>;
  invalidateSession(sessionId: Session["id"]): Promise<{ blankCookie: Cookie }>;
  validatePasswords(
    inputPassword: string,
    usersHashedPassword: string
  ): Promise<boolean>;
  /**
   * Authenticating a user and creating an active session.
   * @param user - user schema for authentication and obtaining a session data
   */
  createSession(
    input: SignUpUser | SignInUser
  ): Promise<{
    user: Pick<User, "id" | "email" | "username">;
    session: Session;
    cookie: Cookie;
  }>;
}
