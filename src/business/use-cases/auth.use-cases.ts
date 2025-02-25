import { injectable, inject } from "inversify";

import type { IAuthenticationUseCases } from "./auth.use-cases.interface";
import type { IUsersRepository } from "@/src/infrastructure/repositories/users.repository.interface";
import type { IAuthenticationService } from "@/src/infrastructure/services/authentication.service.interface";

import {
  SignInUser,
  SignUpUser,
  User,
  USER_TYPE_SIGN_IN,
  USER_TYPE_SIGN_UP,
} from "@/src/business/entities/models/user";
import { Cookie } from "@/src/business/entities/models/cookie";
import { Session } from "@/src/business/entities/models/session";
import { AuthenticationError } from "@/src/business/entities/errors/auth";
import { DI_SYMBOLS } from "@/di/types";
@injectable()
export class AuthenticationUseCases implements IAuthenticationUseCases {
  constructor(
    @inject(DI_SYMBOLS.IUsersRepository)
    private readonly _usersRepository: IUsersRepository,
    @inject(DI_SYMBOLS.IAuthenticationService)
    private readonly _authenticationService: IAuthenticationService
  ) {
    console.log("Instantiated 'AuthenticationUseCases'");
  }

  // Sign-Up business logic
  public async signUp(input: {
    username: string;
    password: string;
    email: string;
  }): Promise<{
    session: Session;
    cookie: Cookie;
    user: Pick<User, "id" | "email" | "username">;
  }> {
    console.log("Executing sign-up use case...");

    const existingUser = await this._usersRepository.getUserByUsername(
      input.username
    );
    if (existingUser) {
      console.error(`User ${input.username} already exists!`);
      throw new AuthenticationError(`User ${input.username} already exists!`);
    }

    const usersWithSuchEmail = await this._usersRepository.getUsersByEmail(
      input.email
    );

    if (usersWithSuchEmail && usersWithSuchEmail.length > 0) {
      throw new AuthenticationError(`Email '${input.email}' is already in use`);
    }

    const newUser: User = await this._usersRepository.createUser({
      email: input.email,
      username: input.username,
      password: input.password,
    });

    const newSignUpUser: SignUpUser = {
      ...newUser,
      type: USER_TYPE_SIGN_UP,
    };

    const { cookie, session } = await this._authenticationService.createSession(
      newSignUpUser
    );

    const isSessionValid = await this._authenticationService.validateSession(
      session.id
    );
    console.log(`Validated session: ${isSessionValid}`);

    return {
      cookie,
      session,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
    };
  }

  // Sign-In business logic
  public async signIn(input: { email: string; password: string }): Promise<{
    user: Pick<User, "id" | "email" | "username">;
    session: Session;
    cookie: Cookie;
  }> {
    console.log("Executing sign-in use case...");

    const newSignInUser: SignInUser = {
      type: USER_TYPE_SIGN_IN,
      email: input.email,
      password: input.password,
    };

    console.log("Sign-in use case: start preparing user session...");
    const { user, cookie, session } =
      await this._authenticationService.createSession(newSignInUser);

    const isSessionValid = await this._authenticationService.validateSession(
      session.id
    );
    console.log(`Validated session: ${isSessionValid}`);

    return {
      user,
      cookie,
      session,
    };
  }

  // Sign-Out business logic
  public async signOut(sessionToken: string): Promise<{ blankCookie: Cookie }> {
    const isSignedOut = this._authenticationService.signOut(sessionToken);

    if (!isSignedOut) {
      throw new AuthenticationError("Could not sign out user");
    }
    return await this._authenticationService.invalidateSession(sessionToken);
  }
}
