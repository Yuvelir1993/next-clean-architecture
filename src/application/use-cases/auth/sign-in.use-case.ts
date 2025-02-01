import { AuthenticationError } from "@/src/entities/errors/auth";
import { Cookie } from "@/src/entities/models/cookie";
import { Session } from "@/src/entities/models/session";
import type { IUsersRepository } from "@/src/application/interfaces/repositories/users.repository.interface";
import type { IAuthenticationService } from "@/src/application/interfaces/services/authentication.service.interface";

export type ISignInUseCase = ReturnType<typeof signInUseCase>;

// TODO: use @injectable class instead like in https://www.youtube.com/watch?v=2NVYG5VDmwQ
// Then you can use all 'auth' use cases in 1 class
export const signInUseCase =
  (
    usersRepository: IUsersRepository,
    authenticationService: IAuthenticationService
  ) =>
  async (input: {
    email: string;
    password: string;
  }): Promise<{ session: Session; cookie: Cookie }> => {
    console.log("Executing sign-in use case...");

    const existingUser = await usersRepository.getUserByEmail(input.email);

    if (!existingUser) {
      console.error("Error in sign-in use case! User does not exist.");
      throw new AuthenticationError("User does not exist");
    }

    console.log("Sign-in use case: start validating user passwords...");
    const validPassword = await authenticationService.validatePasswords(
      input.password,
      existingUser.password_hash
    );

    if (!validPassword) {
      console.error("Error in sign-in use case! Incorrect email or password.");
      throw new AuthenticationError("Incorrect email or password");
    }

    console.log("Sign-in use case: start preparing user session...");
    return await authenticationService.createSession(existingUser);
  };
