import { compare } from "bcrypt-ts";
import { type IUsersRepository } from "@/src/infrastructure/repositories/users.repository.interface";
import { IAuthenticationService } from "@/src/infrastructure/services/authentication.service.interface";
import { Session, sessionSchema } from "@/shared/session/session.schema";
import { Cookie } from "@/shared/cookie/cookie.schema";
import {
  SignUpUser,
  SignInUser,
  USER_TYPE_SIGN_UP,
  USER_TYPE_SIGN_IN,
  User,
} from "@/src/business/domain/entities/user";
import { AuthenticationError } from "@/src/business/errors";
import { inject, injectable } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import {
  AdminInitiateAuthCommand,
  AdminRespondToAuthChallengeCommand,
  AdminUserGlobalSignOutCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { jwtDecode } from "jwt-decode";
import { AWS_COGNITO_SESSION_COOKIE_NAME } from "@/shared/constants";
import { getEmptySessionCookie } from "@/shared/cookie/cookie.service";

@injectable()
export class AuthenticationService implements IAuthenticationService {
  constructor(
    @inject(DI_SYMBOLS.IUsersRepository)
    private readonly _usersRepository: IUsersRepository
  ) {
    console.log("Called AuthenticationService");
  }
  async signOut(sessionToken: string): Promise<boolean> {
    const decodedToken = jwtDecode<{ email: string }>(sessionToken);
    const username = decodedToken["email"];

    if (!username) {
      console.warn("No username found in session token.");
      throw new AuthenticationError(
        `Could not get username '${username}' from session token '${sessionToken}'`
      );
    }

    console.log(
      `Extracted data from the current cookies: username '${username}'`
    );

    const client = new CognitoIdentityProviderClient();
    const input = {
      // AdminUserGlobalSignOutRequest
      UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!, // required
      Username: username, // required
    };
    const command = new AdminUserGlobalSignOutCommand(input);
    const response = await client.send(command);
    console.log(
      `Response from AWS Cognito AdminUserGlobalSignOutCommand '${JSON.stringify(
        response
      )}'`
    );

    return true;
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

  async createSession(userInput: SignUpUser | SignInUser): Promise<{
    user: Pick<User, "id" | "email" | "username">;
    session: Session;
    cookie: Cookie;
  }> {
    console.log(`Creating session for '${JSON.stringify(userInput, null, 2)}'`);

    const client = new CognitoIdentityProviderClient();
    const returnUser: Pick<User, "id" | "email" | "username"> = {
      id: "",
      email: "",
      username: "",
    };

    let IdToken: string | undefined;
    let AccessToken: string | undefined;
    let RefreshToken: string | undefined;

    try {
      if (this.isSignUpUser(userInput)) {
        console.log("Detected CreateUser flow (new account setup)");
        ({ IdToken, AccessToken, RefreshToken } =
          await this.initiateAuthForNewUser(userInput, client));
        returnUser.id = userInput.id;
        returnUser.email = userInput.email;
        returnUser.username = userInput.username;
      } else if (this.isSignInUser(userInput)) {
        console.log("Detected SignInUser flow (normal login)");
        let user: Pick<User, "id" | "username">;
        ({ user, IdToken, AccessToken, RefreshToken } =
          await this.initiateAuthForExistingUser(userInput, client));
        returnUser.id = user.id;
        returnUser.email = userInput.email;
        returnUser.username = user.username;
      } else {
        throw new AuthenticationError(
          `Invalid user type. Should be one of '${USER_TYPE_SIGN_UP}' or '${USER_TYPE_SIGN_IN}'`
        );
      }

      if (!IdToken || !AccessToken || !RefreshToken) {
        throw new Error("Authentication failed: Missing one or more tokens.");
      }

      console.log("IdToken:", IdToken);
      console.log("AccessToken:", AccessToken);
      console.log("RefreshToken:", RefreshToken);
      console.log(`User created: ${JSON.stringify(returnUser, null, 2)}`);

      const oneHour = new Date(Date.now() + 60 * 60 * 1000);
      const session = sessionSchema.parse({
        id: IdToken,
        sessionName: AWS_COGNITO_SESSION_COOKIE_NAME,
        userId: returnUser.id,
        userName: returnUser.username,
        expiresAt: oneHour,
      });

      console.log("Session data validation successful");

      const cookie: Cookie = {
        name: session.sessionName,
        value: session.id,
        attributes: {
          secure: false,
          path: "/",
          sameSite: "strict",
          httpOnly: true,
          maxAge: 3600,
          expires: oneHour,
        },
      };

      return { user: returnUser, session, cookie };
    } catch (error) {
      console.error("Authentication failed:", error);
      throw new AuthenticationError(
        "Invalid credentials or authentication failed."
      );
    }
  }

  async invalidateSession(sessionId: string): Promise<{ blankCookie: Cookie }> {
    console.log("Invalidating session " + sessionId);
    const blankCookie = getEmptySessionCookie();
    return { blankCookie };
  }

  /**
   * Private functions
   */
  async initiateAuthForNewUser(
    userInput: SignUpUser,
    client: CognitoIdentityProviderClient
  ): Promise<{ IdToken: string; AccessToken: string; RefreshToken: string }> {
    try {
      let awsCognitoResponse;
      const initiateAuthCommand = new AdminInitiateAuthCommand({
        UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
        ClientId: process.env.AWS_COGNITO_USER_POOL_CLIENT_ID!,
        AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
        AuthParameters: {
          USERNAME: userInput.email,
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
            USERNAME: userInput.email,
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "ResourceNotFoundException") {
          throw new AuthenticationError(
            "Error: The specified Cognito User Pool does not exist."
          );
        } else if (error.name === "NotAuthorizedException") {
          throw new AuthenticationError(
            "Error: Incorrect username or password."
          );
        } else if (error.name === "UserNotFoundException") {
          throw new AuthenticationError(
            "Error: No user found with the provided email."
          );
        } else {
          console.error("Authentication error:", error.message);
        }

        throw new AuthenticationError(
          `Authentication failed: ${error.message}`
        );
      } else if (error instanceof AuthenticationError) {
        throw error;
      } else {
        console.error("An unknown error occurred:", error);
        throw new Error("Authentication failed due to an unknown error.");
      }
    }
  }

  async initiateAuthForExistingUser(
    userInput: Pick<SignInUser, "email" | "password">,
    client: CognitoIdentityProviderClient
  ): Promise<{
    user: Pick<User, "id" | "username">;
    IdToken: string;
    AccessToken: string;
    RefreshToken: string;
  }> {
    try {
      const initiateAuthCommand = new AdminInitiateAuthCommand({
        UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
        ClientId: process.env.AWS_COGNITO_USER_POOL_CLIENT_ID!,
        AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
        AuthParameters: {
          USERNAME: userInput.email,
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

      const decodedToken = jwtDecode<{
        sub: string;
        "cognito:username": string;
      }>(authenticationResult.IdToken);
      const userId = decodedToken.sub;
      const userName = decodedToken["cognito:username"];

      console.log("Extracted User ID (sub):", userId);
      console.log("Extracted Username (cognito:username):", userName);

      return {
        user: {
          id: userId,
          username: userName,
        },
        IdToken: authenticationResult.IdToken,
        AccessToken: authenticationResult.AccessToken,
        RefreshToken: authenticationResult.RefreshToken,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "ResourceNotFoundException") {
          throw new AuthenticationError(
            "Error: The specified Cognito User Pool does not exist."
          );
        } else if (error.name === "NotAuthorizedException") {
          throw new AuthenticationError(
            "Error: Incorrect username or password."
          );
        } else if (error.name === "UserNotFoundException") {
          throw new AuthenticationError(
            "Error: No user found with the provided email."
          );
        } else {
          console.error("Authentication error:", error.message);
        }

        throw new AuthenticationError(
          `Authentication failed: ${error.message}`
        );
      } else if (error instanceof AuthenticationError) {
        throw error;
      } else {
        console.error("An unknown error occurred:", error);
        throw new Error("Authentication failed due to an unknown error.");
      }
    }
  }

  isSignUpUser(user: SignUpUser | SignInUser): user is SignUpUser {
    return user.type === USER_TYPE_SIGN_UP;
  }

  isSignInUser(user: SignUpUser | SignInUser): user is SignInUser {
    return user.type === USER_TYPE_SIGN_IN;
  }
}
