import { Cookie } from "@/src/business/entities/models/cookie";
import { Session } from "@/src/business/entities/models/session";
import { User } from "@/src/business/entities/models/user";

export interface IAuthenticationService {
  generateUserId(): string;
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
  createSession(input: User): Promise<{ session: Session; cookie: Cookie }>;
}
