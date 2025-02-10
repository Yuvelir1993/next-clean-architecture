import { compare } from "bcrypt-ts";

import { type IUsersRepository } from "@/src/infrastructure/repositories/users.repository.interface";
import { IAuthenticationService } from "@/src/infrastructure/services/authentication.service.interface";
import { Session, sessionSchema } from "@/src/business/entities/models/session";
import { Cookie } from "@/src/business/entities/models/cookie";
import { User } from "@/src/business/entities/models/user";
import {
  AuthenticationError,
  UnauthenticatedError,
} from "@/src/business/entities/errors/auth";
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
    userInput: User
  ): Promise<{ session: Session; cookie: Cookie }> {
    console.log("Creating session for logged in user");
    let awsCognitoResponse;

    const client = new CognitoIdentityProviderClient();
    const initiateAuthCommand = new AdminInitiateAuthCommand({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
      ClientId: process.env.AWS_COGNITO_USER_POOL_CLIENT_ID!,
      AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: userInput.username,
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
          USERNAME: userInput.username,
          NEW_PASSWORD: userInput.password,
        },
      });
      awsCognitoResponse = await client.send(respondCommand);
      const authenticationResult = awsCognitoResponse.AuthenticationResult;

      if (
        !authenticationResult ||
        !authenticationResult.IdToken ||
        !authenticationResult.AccessToken ||
        !authenticationResult.RefreshToken
      ) {
        throw new AuthenticationError(
          "Failed to authenticate: Missing tokens from AWS Cognito response..."
        );
      }

      const { IdToken, AccessToken, RefreshToken } = authenticationResult;

      console.log("Tokens:", IdToken, AccessToken, RefreshToken);

      const session = sessionSchema.parse({
        id: awsCognitoResponse?.AuthenticationResult?.IdToken,
        userId: userInput.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });

      console.log("Session data validation successful");

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
    } else {
      throw new AuthenticationError(
        `Unsupported challenge from aWS Cognito ${authResponse.ChallengeName}`
      );
    }
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

  /**
   * Generates random 6-digit numeric ID
   * @returns random 6-digit ID
   */
  generateUserId(): string {
    const randomId = crypto.randomUUID().replace(/\D/g, "").slice(0, 6);
    console.log(`Generated random user id ${randomId}`);
    return randomId;
  }
}
