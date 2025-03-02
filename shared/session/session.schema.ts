import { z } from "zod";

export const sessionSchema = z.object({
  id: z.string(),
  sessionName: z.string(),
  userId: z.string(),
  userName: z.string(),
  expiresAt: z.date(),
});

export type Session = z.infer<typeof sessionSchema>;

/**
 * This schema is used for serializing and deserializing the session
 * stored in the cookie. Note that we include a `session` field that
 * holds the JWT token.
 */
export const cookieSessionSchema = z.object({
  id: z.string(),
  session: z.string(),
  userId: z.string(),
  userName: z.string(),
  expiresAt: z.date(),
});

export type CookieSession = z.infer<typeof cookieSessionSchema>;
