import { IAuthenticationController } from "@/src/adapters/controllers/auth.controller.interface";
import { User } from "@/src/business/domain/entities/models/user";
import { Session } from "@/shared/session/session.schema";
import { Cookie } from "@/shared/cookie/cookie.schema";
import {
  SignInInput,
  SignUpInput,
} from "@/src/adapters/controllers/auth.controller.inputSchemas";

export class AuthenticationControllerMock implements IAuthenticationController {
  async signIn(input: SignInInput): Promise<{
    session: Session;
    cookie: Cookie;
    user: Pick<User, "id" | "username">;
  }> {
    console.log("[mock] Signing in with input", input);

    const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);

    return {
      session: {
        id: "mock-session-id",
        sessionName: "mockSessionName",
        userId: "mock-user-id",
        userName: "mock-username",
        expiresAt: oneHourLater,
      },
      cookie: {
        name: "mockSessionName",
        value: "mock-session-id",
        attributes: {
          secure: true,
          path: "/",
          sameSite: "strict",
          httpOnly: true,
          maxAge: 3600,
          expires: oneHourLater,
        },
      },
      user: {
        id: "mock-user-id",
        username: "mock-username",
      },
    };
  }

  async signUp(input: SignUpInput): Promise<{
    session: Session;
    cookie: Cookie;
    user: Pick<User, "id" | "email" | "username">;
  }> {
    console.log("[mock] Signing up with input", input);

    const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);

    return {
      session: {
        id: "mock-session-id",
        sessionName: "mockSessionName",
        userId: "mock-user-id",
        userName: "mock-username",
        expiresAt: oneHourLater,
      },
      cookie: {
        name: "mockSessionName",
        value: "mock-session-id",
        attributes: {
          secure: true,
          path: "/",
          sameSite: "strict",
          httpOnly: true,
          maxAge: 3600,
          expires: oneHourLater,
        },
      },
      user: {
        id: "mock-user-id",
        email: "mock@example.com",
        username: "mock-username",
      },
    };
  }

  async signOut(sessionToken: string | undefined): Promise<Cookie> {
    console.log("[mock] Signing out session token", sessionToken);

    return {
      name: "mockSessionName",
      value: "",
      attributes: {
        secure: true,
        path: "/",
        sameSite: "strict",
        httpOnly: true,
        maxAge: 0,
        expires: new Date(0),
      },
    };
  }
}
