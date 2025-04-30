import { getInjection } from "@/di/container";
import { DI_SYMBOLS } from "@/di/types";

import { describe, it, expect, beforeEach } from "vitest";
import {
  USER_TYPE_SIGN_IN,
  USER_TYPE_SIGN_UP,
} from "@/src/business/domain/entities/models/user";
import { IAuthenticationService } from "@/src/infrastructure/services/authentication.service.interface";

let authService: IAuthenticationService;

beforeEach(() => {
  authService = getInjection<IAuthenticationService>(
    DI_SYMBOLS.IAuthenticationService
  );
});

describe("AuthenticationServiceMock", () => {
  it("should create session for SignUpUser", async () => {
    const signUpUser = {
      id: "signup-user-id",
      email: "signup@example.com",
      username: "signupUser",
      password: "password123",
      type: USER_TYPE_SIGN_UP,
    };

    const { user, session, cookie } = await authService.createSession(
      signUpUser
    );

    expect(user.id).toBe("signup-user-id");
    expect(user.username).toBe("signupUser");
    expect(user.email).toBe("signup@example.com");
    expect(session.userId).toBe("signup-user-id");
    expect(cookie.name).toBe("mockSessionName");
  });

  it("should create session for SignInUser", async () => {
    const signInUser = {
      email: "signin@example.com",
      password: "password123",
      type: USER_TYPE_SIGN_IN,
    };

    const { user, session, cookie } = await authService.createSession(
      signInUser
    );

    expect(user.id).toBe("mock-user-id");
    expect(user.username).toBe("mock-username");
    expect(user.email).toBe("signin@example.com");
    expect(session.userId).toBe("mock-user-id");
    expect(cookie.name).toBe("mockSessionName");
  });

  it("should validate correct password", async () => {
    const result = await authService.validatePasswords(
      "password123",
      "password123"
    );
    expect(result).toBe(true);
  });

  it("should invalidate incorrect password", async () => {
    const result = await authService.validatePasswords(
      "password123",
      "wrongpassword"
    );
    expect(result).toBe(false);
  });

  it("should validate a valid session", async () => {
    const isValid = await authService.validateSession("valid-session");
    expect(isValid).toBe(true);
  });

  it("should invalidate an invalid session", async () => {
    const isValid = await authService.validateSession("invalid-session");
    expect(isValid).toBe(false);
  });

  it("should sign out successfully", async () => {
    const result = await authService.signOut("mock-token");
    expect(result).toBe(true);
  });

  it("should invalidate session and return blank cookie", async () => {
    const { blankCookie } = await authService.invalidateSession(
      "mock-session-id"
    );
    const sessionValue = JSON.parse(blankCookie.value);

    expect(sessionValue.id).toBe("");
    expect(sessionValue.session).toBe("");
    expect(sessionValue.userId).toBe("");
    expect(sessionValue.userName).toBe("");
  });
});
