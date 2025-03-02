// shared/session/session.service.ts
import { cookies } from "next/headers";
import {
  cookieSessionSchema,
  CookieSession,
} from "@/shared/session/session.schema";
import { SessionValidationError } from "@/shared/session/session.errors";
import { AWS_COGNITO_SESSION_COOKIE_NAME } from "../constants";

/**
 * Extracts and validates a session from a cookie value.
 * Returns the parsed session object if valid, or throws a SessionValidationError otherwise.
 */
export function extractSessionFromCookie(cookieValue: string): CookieSession {
  try {
    const parsed = JSON.parse(cookieValue);
    const result = cookieSessionSchema.safeParse(parsed);
    if (!result.success) {
      throw new SessionValidationError(
        `Session cookie validation failed: ${result.error.message}`
      );
    }
    return result.data;
  } catch (error: unknown) {
    if (error instanceof SessionValidationError) {
      throw new SessionValidationError(
        `Failed to parse session cookie: ${error.message}`
      );
    } else {
      throw new Error(
        "Unexpected error during retrieving session token from cookie!"
      );
    }
  }
}

/**
 * Retrieves the session cookie value from the Next.js cookies store,
 * then extracts and validates the session.
 * Throws a SessionValidationError if the cookie is missing or invalid.
 */
export async function getSessionFromCookies(): Promise<CookieSession> {
  const cookieStore = await cookies();
  const sessionCookieValue = cookieStore.get(
    AWS_COGNITO_SESSION_COOKIE_NAME
  )?.value;
  if (!sessionCookieValue) {
    throw new SessionValidationError("Missing session cookie");
  }
  return extractSessionFromCookie(sessionCookieValue);
}


