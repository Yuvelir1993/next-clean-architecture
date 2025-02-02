import { z } from "zod";
import { Cookie } from "@/src/entities/models/cookie";
import { Session } from "@/src/entities/models/session";
import { User } from "@/src/entities/models/user";

// Zod schema for sign-in input validation
export const signInInputSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, { message: "Be at least 6 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

// Zod schema for sign-up input validation
export const signUpInputSchema = z
  .object({
    username: z.string().min(3).max(31),
    password: z.string().min(6).max(31),
    confirm_password: z.string().min(6).max(31),
  })
  .superRefine(({ password, confirm_password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["password"],
      });
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

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
  signIn(input: Partial<z.infer<typeof signInInputSchema>>): Promise<Cookie>;

  /**
   * Handles user sign out.
   *
   * @param sessionId - The session ID to be validated and invalidated.
   * @returns A promise that resolves to a Cookie.
   */
  signOut(sessionId: string | undefined): Promise<Cookie>;

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
