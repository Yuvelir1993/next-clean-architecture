import { z } from "zod";
import { Cookie } from "@/src/business/entities/models/cookie";
import { Session } from "@/src/business/entities/models/session";
import { User } from "@/src/business/entities/models/user";
import {
  signInInputSchema,
  signUpInputSchema,
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
  signIn(input: Partial<z.infer<typeof signInInputSchema>>): Promise<{
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
  signUp(input: Partial<z.infer<typeof signUpInputSchema>>): Promise<{
    session: Session;
    cookie: Cookie;
    user: Pick<User, "id" | "username">;
  }>;
}
