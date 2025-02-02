import { compare } from "bcrypt-ts";

import { type IUsersRepository } from "@/src/business/interfaces/repositories/users.repository.interface";
import { IAuthenticationService } from "@/src/infrastructure/services/authentication.service.interface";
import { Session, sessionSchema } from "@/src/business/entities/models/session";
import { Cookie } from "@/src/business/entities/models/cookie";
import { User } from "@/src/business/entities/models/user";
import { UnauthenticatedError } from "@/src/business/entities/errors/auth";
import { inject, injectable } from "inversify";
import { DI_SYMBOLS } from "@/di/types";

@injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(
    @inject(DI_SYMBOLS.IUsersRepository)
    private readonly _usersRepository: IUsersRepository
  ) {
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
    console.log("Creating session for logged in user");

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
