import type { IAuthenticationUseCases } from "./auth.use-cases.interface";
import type { IUsersRepository } from "@/src/infrastructure/repositories/users.repository.interface";
import type { IAuthenticationService } from "@/src/infrastructure/services/authentication.service.interface";

import { injectable, inject } from "inversify";
import { AuthenticationError } from "@/src/business/entities/errors/auth";
import { Cookie } from "@/src/business/entities/models/cookie";
import { Session } from "@/src/business/entities/models/session";
import { DI_SYMBOLS } from "@/di/types";
import { User } from "@/src/business/entities/models/user";

@injectable()
export class AuthenticationUseCases implements IAuthenticationUseCases {
  constructor(
    @inject(DI_SYMBOLS.IUsersRepository)
    private readonly _usersRepository: IUsersRepository,
    @inject(DI_SYMBOLS.IAuthenticationService)
    private readonly _authenticationService: IAuthenticationService
  ) {
    console.log("Entered AuthenticationUseCases...");
  }

  // Sign-In business logic
  public async signIn(input: {
    email: string;
    password: string;
  }): Promise<{ session: Session; cookie: Cookie }> {
    console.log("Executing sign-in use case...");

    const existingUser = await this._usersRepository.getUserByEmail(
      input.email
    );

    if (!existingUser) {
      console.error("Error in sign-in use case! User does not exist.");
      throw new AuthenticationError("User does not exist");
    }

    console.log("Sign-in use case: start validating user passwords...");
    const validPassword = await this._authenticationService.validatePasswords(
      input.password,
      existingUser.password_hash
    );

    if (!validPassword) {
      console.error("Error in sign-in use case! Incorrect email or password.");
      throw new AuthenticationError("Incorrect email or password");
    }

    console.log("Sign-in use case: start preparing user session...");
    return await this._authenticationService.createSession(existingUser);
  }

  // Sign-Out business logic
  public async signOut(sessionId: string): Promise<{ blankCookie: Cookie }> {
    return await this._authenticationService.invalidateSession(sessionId);
  }

  // Sign-Up business logic
  public async signUp(input: { username: string; password: string }): Promise<{
    session: Session;
    cookie: Cookie;
    user: Pick<User, "id" | "username">;
  }> {
    console.log("Executing sign-up use case...");

    const existingUser = await this._usersRepository.getUserByUsername(
      input.username
    );
    if (existingUser) {
      throw new AuthenticationError("Username taken");
    }

    const userId = this._authenticationService.generateUserId();

    const newUser = await this._usersRepository.createUser({
      id: userId,
      username: input.username,
      password: input.password,
    });

    const { cookie, session } = await this._authenticationService.createSession(
      newUser
    );

    return {
      cookie,
      session,
      user: {
        id: newUser.id,
        username: newUser.username,
      },
    };
  }
}
