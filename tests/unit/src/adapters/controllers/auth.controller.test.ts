import { getInjection } from "@/di/container";
import { DI_SYMBOLS } from "@/di/types";

import { describe, it, expect, beforeEach } from "vitest";
import { IAuthenticationController } from "@/src/adapters/controllers/auth.controller.interface";

let authController: IAuthenticationController;

beforeEach(() => {
  authController = getInjection<IAuthenticationController>(
    DI_SYMBOLS.IAuthenticationController
  );
});

describe("AuthenticationControllerMock", () => {
  it("should sign in a user", async () => {
    const signInInput = {
      email: "user@example.com",
      password: "Password123!",
    };

    const { session, cookie, user } = await authController.signIn(signInInput);

    expect(session).toBeDefined();
    expect(cookie).toBeDefined();
    expect(user).toBeDefined();
    expect(user.id).toBe("mock-user-id");
    expect(user.username).toBe("mock-username");
    expect(cookie.name).toBe("mockSessionName");
  });

  it("should sign up a new user", async () => {
    const signUpInput = {
      email: "newuser@example.com",
      username: "newuser",
      password: "Password123!",
      confirm_password: "Password123!",
    };

    const { session, cookie, user } = await authController.signUp(signUpInput);

    expect(session).toBeDefined();
    expect(cookie).toBeDefined();
    expect(user).toBeDefined();
    expect(user.id).toBe("mock-user-id");
    expect(user.username).toBe("mock-username");
    expect(cookie.name).toBe("mockSessionName");
  });

  it("should sign out a user", async () => {
    const cookie = await authController.signOut("mock-session-token");

    expect(cookie).toBeDefined();
    expect(cookie.name).toBe("mockSessionName");
    expect(cookie.value).toBe("");
    expect(cookie.attributes.maxAge).toBe(0);
  });
});
