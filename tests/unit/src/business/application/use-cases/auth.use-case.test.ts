import { getInjection } from "@/di/container";
import { DI_SYMBOLS } from "@/di/types";
import { describe, it, expect, beforeEach } from "vitest";
import { IAuthenticationUseCases } from "@/src/business/application/use-cases/auth.use-cases.interface";
import type { Session } from "@/shared/session/session.schema";
import type { Cookie } from "@/shared/cookie/cookie.schema";
import type { User } from "@/src/business/domain/entities/user";

let authUseCases: IAuthenticationUseCases;

beforeEach(() => {
  authUseCases = getInjection<IAuthenticationUseCases>(
    DI_SYMBOLS.IAuthenticationUseCases
  );
});

describe("AuthenticationUseCases Public API", () => {
  it("should sign in an existing user", async () => {
    const email = "user@example.com";
    const password = "Password123!";

    const result = await authUseCases.signIn({ email, password });

    // Basic shape assertions
    expect(result).toHaveProperty("user");
    expect(result).toHaveProperty("session");
    expect(result).toHaveProperty("cookie");

    expect((result.user as User).email).toBe(email);

    expect((result.session as Session).expiresAt).toBeInstanceOf(Date);

    expect((result.cookie as Cookie).attributes.expires).toBeInstanceOf(Date);
  });

  it("should sign up a new user", async () => {
    const username = "newUser";
    const password = "NewPass123!";

    const result = await authUseCases.signUp({ username, password });

    expect(result).toHaveProperty("user");
    expect(result).toHaveProperty("session");
    expect(result).toHaveProperty("cookie");

    expect(result.user.username).toBe(username);
    expect((result.session as Session).expiresAt).toBeInstanceOf(Date);
    expect((result.cookie as Cookie).attributes.expires).toBeInstanceOf(Date);
  });

  it("should sign out a user", async () => {
    const dummySessionId = "dummy-session";

    const { blankCookie } = await authUseCases.signOut(dummySessionId);

    expect(blankCookie).toHaveProperty("name");
    expect(blankCookie.attributes.expires).toBeInstanceOf(Date);
  });
});
