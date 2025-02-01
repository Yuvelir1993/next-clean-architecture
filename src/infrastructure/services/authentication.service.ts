import { compare } from "bcrypt-ts";

import { type IUsersRepository } from "@/src/application/repositories/users.repository.interface";
import { IAuthenticationService } from "@/src/application/services/authentication.service.interface";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { Cookie } from "@/src/entities/models/cookie";
import { Session, sessionSchema } from "@/src/entities/models/session";
import { User } from "@/src/entities/models/user";

export class AuthenticationService implements IAuthenticationService {
  constructor(private readonly _usersRepository: IUsersRepository) {
    console.log("Called AuthenticationService");
  }

  validatePasswords(
    inputPassword: string,
    usersHashedPassword: string
  ): Promise<boolean> {
    return compare(inputPassword, usersHashedPassword);
  }

  async validateSession(
    sessionId: string
  ): Promise<{ user: User; session: Session }> {
    const result: {
      user: {
        name: string;
        id: string;
      };
      session: Session;
    } = {
      user: {
        name: "Pavlo",
        id: "12345",
      },
      session: {
        id: sessionId,
        userId: "12345",
        expiresAt: new Date(),
      },
    };

    if (!result.user || !result.session) {
      throw new UnauthenticatedError("Unauthenticated");
    }

    const user = await this._usersRepository.getUserById(result.user.id);
    if (!user) {
      throw new UnauthenticatedError("User doesn't exist");
    }

    return { user, session: result.session };
  }

  async createSession(
    user: User
  ): Promise<{ session: Session; cookie: Cookie }> {
    const mockedSessionData = {
      id: "mock-session-id",
      userId: user.id,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    };
    const session = sessionSchema.parse(mockedSessionData);

    const cookie: Cookie = {
      name: "session",
      value: "mock-cookie-value",
      attributes: {
        secure: true,
        path: "/",
        sameSite: "strict",
        httpOnly: true,
        maxAge: 3600,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      },
    };

    return { session, cookie };
  }

  async invalidateSession(sessionId: string): Promise<{ blankCookie: Cookie }> {
    console.log("Invalidating session " + sessionId);
    const blankCookie: Cookie = {
      name: "session",
      value: "mock-cookie-value",
      attributes: {
        secure: true,
        path: "/",
        sameSite: "strict",
        httpOnly: true,
        maxAge: 3600,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      },
    };
    return { blankCookie };
  }

  generateUserId(): string {
    return "RandomUserId123456";
  }
}
