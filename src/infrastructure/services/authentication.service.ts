import { compare } from "bcrypt-ts";

import { type IUsersRepository } from "@/src/infrastructure/repositories/users.repository.interface";
import { IAuthenticationService } from "@/src/infrastructure/services/authentication.service.interface";
import { Session, sessionSchema } from "@/src/business/entities/models/session";
import { Cookie } from "@/src/business/entities/models/cookie";
import {
  SignUpUser,
  signUpUserSchema,
  signInUserSchema,
  User,
} from "@/src/business/entities/models/user";
import { AuthenticationError } from "@/src/business/entities/errors/auth";
import { inject, injectable } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import {
  AdminInitiateAuthCommand,
  AdminRespondToAuthChallengeCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoJwtVerifier } from "aws-jwt-verify";

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

  async validateSession(sessionId: string): Promise<boolean> {
    console.log("Validating user's session...");
    const verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
      tokenUse: "id",
      clientId: process.env.AWS_COGNITO_USER_POOL_CLIENT_ID!,
    });

    try {
      const payload = await verifier.verify(sessionId);
      console.log("Token is valid. Payload:", payload);
      return true;
    } catch {
      console.log("Token not valid!");
      return false;
    }
  }

  async createSession(
    userInput: User
  ): Promise<{ session: Session; cookie: Cookie }> {
    console.log("Creating session for logged in user " + userInput);

    const client = new CognitoIdentityProviderClient();
    let IdToken: string | undefined;
    let AccessToken: string | undefined;
    let RefreshToken: string | undefined;

    try {
      if (signUpUserSchema.safeParse(userInput).success) {
        console.log("Detected CreateUser flow (new account setup)");
        ({ IdToken, AccessToken, RefreshToken } =
          await this.initiateAuthForNewUser(userInput, client));
      } else if (signInUserSchema.safeParse(userInput).success) {
        console.log("Detected SignInUser flow (normal login)");
        ({ IdToken, AccessToken, RefreshToken } =
          await this.initiateAuthForExistingUser(userInput, client));
      } else {
        throw new AuthenticationError("Invalid user type provided");
      }

      if (!IdToken || !AccessToken || !RefreshToken) {
        throw new Error("Authentication failed: Missing one or more tokens.");
      }

      console.log("IdToken:", IdToken);
      console.log("AccessToken:", AccessToken);
      console.log("RefreshToken:", RefreshToken);

      const oneHour = new Date(Date.now() + 60 * 60 * 1000);
      const session = sessionSchema.parse({
        id: IdToken,
        userId: userInput.id,
        expiresAt: oneHour,
      });

      console.log("Session data validation successful");

      const cookie: Cookie = {
        name: "AwsCognitoSession",
        value: IdToken,
        attributes: {
          secure: false,
          path: "/",
          sameSite: "strict",
          httpOnly: true,
          maxAge: 3600,
          expires: oneHour,
        },
      };

      return { session, cookie };
    } catch (error) {
      console.error("Authentication failed:", error);
      throw new AuthenticationError(
        "Invalid credentials or authentication failed."
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
   * Private functions
   */
  async initiateAuthForNewUser(
    userInput: SignUpUser,
    client: CognitoIdentityProviderClient
  ): Promise<{ IdToken: string; AccessToken: string; RefreshToken: string }> {
    let awsCognitoResponse;
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
        ChallengeName: authResponse.ChallengeName,
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

      return {
        IdToken: authenticationResult.IdToken,
        AccessToken: authenticationResult.AccessToken,
        RefreshToken: authenticationResult.RefreshToken,
      };
    } else {
      throw new AuthenticationError(
        `Unsupported challenge from AWS Cognito ${authResponse.ChallengeName}`
      );
    }
  }

  async initiateAuthForExistingUser(
    userInput: SignUpUser,
    client: CognitoIdentityProviderClient
  ): Promise<{ IdToken: string; AccessToken: string; RefreshToken: string }> {
    const initiateAuthCommand = new AdminInitiateAuthCommand({
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
      ClientId: process.env.AWS_COGNITO_USER_POOL_CLIENT_ID!,
      AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: userInput.username,
        PASSWORD: userInput.password,
      },
    });
    const awsCognitoResponse = await client.send(initiateAuthCommand);
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

    return {
      IdToken: authenticationResult.IdToken,
      AccessToken: authenticationResult.AccessToken,
      RefreshToken: authenticationResult.RefreshToken,
    };
  }
}
