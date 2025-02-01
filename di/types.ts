import { IAuthenticationService } from "@/src/application/interfaces/services/authentication.service.interface";

import { IUsersRepository } from "@/src/application/interfaces/repositories/users.repository.interface";

import { ISignInUseCase } from "@/src/application/use-cases/auth/sign-in.use-case";
import { ISignUpUseCase } from "@/src/application/use-cases/auth/sign-up.use-case";
import { ISignOutUseCase } from "@/src/application/use-cases/auth/sign-out.use-case";

import { ISignInController } from "@/src/interface-adapters/controllers/auth/sign-in.controller";
import { ISignOutController } from "@/src/interface-adapters/controllers/auth/sign-out.controller";
import { ISignUpController } from "@/src/interface-adapters/controllers/auth/sign-up.controller";

export const DI_SYMBOLS = {
  // Services
  IAuthenticationService: Symbol.for("IAuthenticationService"),

  // Controllers
  ISignInController: Symbol.for("ISignInController"),
  ISignOutController: Symbol.for("ISignOutController"),
  ISignUpController: Symbol.for("ISignUpController"),

  // Use Cases
  ISignInUseCase: Symbol.for("ISignInUseCase"),
  ISignOutUseCase: Symbol.for("ISignOutUseCase"),
  ISignUpUseCase: Symbol.for("ISignUpUseCase"),

  // Repositories
  IUsersRepository: Symbol.for("IUsersRepository"),
};

export interface DI_RETURN_TYPES {
  // Services
  IAuthenticationService: IAuthenticationService;

  // Controllers
  ISignInController: ISignInController;
  ISignOutController: ISignOutController;
  ISignUpController: ISignUpController;

  // Use Cases
  ISignInUseCase: ISignInUseCase;
  ISignOutUseCase: ISignOutUseCase;
  ISignUpUseCase: ISignUpUseCase;

  // Repositories
  IUsersRepository: IUsersRepository;
}
