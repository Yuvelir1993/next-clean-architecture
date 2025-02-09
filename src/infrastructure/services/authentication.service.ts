import { compare } from "bcrypt-ts";

import { type IUsersRepository } from "@/src/infrastructure/repositories/users.repository.interface";
import { IAuthenticationService } from "@/src/infrastructure/services/authentication.service.interface";
import { Session, sessionSchema } from "@/src/business/entities/models/session";
import { Cookie } from "@/src/business/entities/models/cookie";
import { User } from "@/src/business/entities/models/user";
import { UnauthenticatedError } from "@/src/business/entities/errors/auth";
import { inject, injectable } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import {
  AdminInitiateAuthCommand,
  AdminRespondToAuthChallengeCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

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
    input: User
  ): Promise<{ session: Session; cookie: Cookie }> {
    console.log("Creating session for logged in user");

    const client = new CognitoIdentityProviderClient();
    const initiateAuthCommand = new AdminInitiateAuthCommand({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
      ClientId: process.env.AWS_COGNITO_USER_POOL_CLIENT_ID!,
      AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: input.username,
        PASSWORD: process.env.AWS_COGNITO_USER_TEMP_PASSWORD!,
      },
    });
    const authResponse = await client.send(initiateAuthCommand);

    if (authResponse.ChallengeName === "NEW_PASSWORD_REQUIRED") {
      const respondCommand = new AdminRespondToAuthChallengeCommand({
        UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
        ClientId: process.env.AWS_COGNITO_USER_POOL_CLIENT_ID!,
        ChallengeName: "NEW_PASSWORD_REQUIRED",
        Session: authResponse.Session,
        ChallengeResponses: {
          USERNAME: input.username,
          NEW_PASSWORD: input.password_hash,
        },
      });
      const finalResponse = await client.send(respondCommand);
      console.log("Tokens:", finalResponse.AuthenticationResult);
    }

    const mockedSessionData = {
      id: "mock-session-id",
      userId: input.id,
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
    console.log(`Generated random user id`);
    return "RandomUserId123456";
  }
}
