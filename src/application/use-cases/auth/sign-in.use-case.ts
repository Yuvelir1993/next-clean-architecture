import { AuthenticationError } from "@/src/entities/errors/auth";
import { Cookie } from "@/src/entities/models/cookie";
import { Session } from "@/src/entities/models/session";
import type { IUsersRepository } from "@/src/application/repositories/users.repository.interface";
import type { IAuthenticationService } from "@/src/application/services/authentication.service.interface";

export type ISignInUseCase = ReturnType<typeof signInUseCase>;

export const signInUseCase =
  (
    usersRepository: IUsersRepository,
    authenticationService: IAuthenticationService
  ) =>
  async (input: {
    username: string;
    password: string;
  }): Promise<{ session: Session; cookie: Cookie }> => {
    const existingUser = await usersRepository.getUserByUsername(
      input.username
    );

    if (!existingUser) {
      throw new AuthenticationError("User does not exist");
    }

    const validPassword = await authenticationService.validatePasswords(
      input.password,
      existingUser.password_hash
    );

    if (!validPassword) {
      throw new AuthenticationError("Incorrect username or password");
    }

    return await authenticationService.createSession(existingUser);
  };
