// shared/session/session.service.ts
import { cookies } from "next/headers";
import {
  AwsCognitoSessionJwtPayload,
  sessionSchema,
  Session,
} from "@/shared/session/session.schema";
import { SessionValidationError } from "@/shared/session/session.errors";
import { AWS_COGNITO_SESSION_COOKIE_NAME } from "../constants";
import { jwtDecode } from "jwt-decode";

/**
 * Extracts and validates a session from a cookie value.
 * The cookie is expected to contain a JSON string with at least a 'session' field (the JWT).
 * This function decodes the JWT to construct a full session object that conforms to our schema.
 */
export function extractSessionFromCookie(
  cookieValue: string,
  sessionName: string
): Session {
  try {
    const parsed = JSON.parse(cookieValue);
    if (!parsed.session) {
      throw new SessionValidationError("Missing JWT token in session cookie");
    }
    const decoded = jwtDecode<AwsCognitoSessionJwtPayload>(parsed.session);

    // Map the Cognito payload to our session object.
    const sessionObject = {
      id: decoded.sub,
      sessionName: sessionName,
      userId: decoded.sub,
      userName: decoded.name,
      expiresAt: new Date(decoded.exp * 1000),
    };

    const result = sessionSchema.safeParse(sessionObject);
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
export async function getSessionFromCookies(): Promise<Session> {
  const cookieStore = await cookies();
  const sessionName = AWS_COGNITO_SESSION_COOKIE_NAME;
  const sessionCookieValue = cookieStore.get(sessionName)?.value;
  if (!sessionCookieValue) {
    throw new SessionValidationError("Missing session cookie");
  }
  return extractSessionFromCookie(sessionCookieValue, sessionName);
}
