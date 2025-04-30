import { Cookie } from "@/shared/cookie/cookie.schema";
import { Session } from "@/shared/session/session.schema";
import { User } from "@/src/business/domain/entities/models/user";
import {
  SignInInput,
  SignUpInput,
} from "@/src/adapters/controllers/auth.controller.inputSchemas";

/**
 * Interface for the Auth Controller.
 *
 * It defines the three operations: signIn, signOut, and signUp.
 */
export interface IAuthenticationController {
  /**
   * Handles user sign in.
   *
   * @param input - A partial object matching the sign-in schema.
   * @returns A promise that resolves to a Cookie.
   */
  signIn(input: SignInInput): Promise<{
    session: Session;
    cookie: Cookie;
    user: Pick<User, "id" | "username">;
  }>;

  /**
   * Handles user sign out.
   *
   * @param sessionToken - The session token to be decoded, validated and invalidated.
   * @returns A promise that resolves to a Cookie.
   */
  signOut(sessionToken: string | undefined): Promise<Cookie>;

  /**
   * Handles user sign up.
   *
   * @param input - A partial object matching the sign-up schema.
   * @returns A promise that resolves to an object containing a session, cookie, and user (with id and username).
   */
  signUp(input: SignUpInput): Promise<{
    session: Session;
    cookie: Cookie;
    user: Pick<User, "id" | "username">;
  }>;
}
