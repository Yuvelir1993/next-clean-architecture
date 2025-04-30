import { IAuthenticationService } from "@/src/infrastructure/services/authentication.service.interface";
import {
  SignInUser,
  SignUpUser,
  User,
  USER_TYPE_SIGN_IN,
  USER_TYPE_SIGN_UP,
} from "@/src/business/domain/entities/models/user";
import { Session } from "@/shared/session/session.schema";
import { Cookie } from "@/shared/cookie/cookie.schema";
import { getEmptySessionCookie } from "@/shared/cookie/cookie.service";

export class AuthenticationServiceMock implements IAuthenticationService {
  async signOut(sessionToken: string): Promise<boolean> {
    console.log(`[mock] Signing out session '${sessionToken}'`);
    return true;
  }

  validatePasswords(
    inputPassword: string,
    usersHashedPassword: string
  ): Promise<boolean> {
    console.log(`[mock] Validating passwords`);
    return Promise.resolve(inputPassword === usersHashedPassword);
  }

  async validateSession(sessionId: string): Promise<boolean> {
    console.log(`[mock] Validating session '${sessionId}'`);
    return sessionId === "valid-session";
  }

  async createSession(userInput: SignUpUser | SignInUser): Promise<{
    user: Pick<User, "id" | "email" | "username">;
    session: Session;
    cookie: Cookie;
  }> {
    console.log(`[mock] Creating session for user '${userInput.email}'`);

    const oneHourLater = new Date(Date.now() + 60 * 60 * 1000);

    let username: string;
    let userId: string;

    if (this.isSignUpUser(userInput)) {
      userId = userInput.id;
      username = userInput.username;
    } else if (this.isSignInUser(userInput)) {
      userId = "mock-user-id";
      username = "mock-username";
    } else {
      throw new Error("Invalid user type");
    }

    return {
      user: {
        id: userId,
        email: userInput.email,
        username: username,
      },
      session: {
        id: "mock-session-id",
        sessionName: "mockSessionName",
        userId: userId,
        userName: username,
        expiresAt: oneHourLater,
      },
      cookie: {
        name: "mockSessionName",
        value: "mock-session-id",
        attributes: {
          secure: false,
          path: "/",
          sameSite: "strict",
          httpOnly: true,
          maxAge: 3600,
          expires: oneHourLater,
        },
      },
    };
  }

  async invalidateSession(sessionId: string): Promise<{ blankCookie: Cookie }> {
    console.log(`[mock] Invalidating session '${sessionId}'`);
    return { blankCookie: getEmptySessionCookie() };
  }

  isSignUpUser(user: SignUpUser | SignInUser): user is SignUpUser {
    return user.type === USER_TYPE_SIGN_UP;
  }

  isSignInUser(user: SignUpUser | SignInUser): user is SignInUser {
    return user.type === USER_TYPE_SIGN_IN;
  }
}
