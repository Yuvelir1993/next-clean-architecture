import { AuthenticationError } from "@/src/entities/errors/auth";
import { Cookie } from "@/src/entities/models/cookie";
import { Session } from "@/src/entities/models/session";
import { User } from "@/src/entities/models/user";
import type { IAuthenticationService } from "@/src/application/interfaces/services/authentication.service.interface";
import type { IUsersRepository } from "@/src/application/interfaces/repositories/users.repository.interface";

export type ISignUpUseCase = ReturnType<typeof signUpUseCase>;

export const signUpUseCase =
  (
    authenticationService: IAuthenticationService,
    usersRepository: IUsersRepository
  ) =>
  async (input: {
    username: string;
    password: string;
  }): Promise<{
    session: Session;
    cookie: Cookie;
    user: Pick<User, "id" | "username">;
  }> => {
    console.log("Executing sign-up use case...");

    const existingUser = await usersRepository.getUserByUsername(
      input.username
    );
    if (existingUser) {
      throw new AuthenticationError("Username taken");
    }

    const userId = authenticationService.generateUserId();

    const newUser = await usersRepository.createUser({
      id: userId,
      username: input.username,
      password: input.password,
    });

    const { cookie, session } = await authenticationService.createSession(
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
  };
