import { IAuthenticationService } from "@/src/infrastructure/services/authentication.service.interface";

import { IUsersRepository } from "@/src/business/interfaces/repositories/users.repository.interface";
import { IAuthenticationController } from "@/src/adapters/controllers/auth.controller.interface";
import { IAuthenticationUseCases } from "@/src/business/interfaces/use-cases/authentication.use-cases.interface";

// Symbols are guaranteed to be unique, preventing accidental name collisions.
export const DI_SYMBOLS = {
  // Services
  IAuthenticationService: Symbol.for("IAuthenticationService"),

  // Controllers
  IAuthenticationController: Symbol.for("IAuthenticationController"),

  // Use Cases
  IAuthenticationUseCases: Symbol.for("IAuthenticationUseCases"),

  // Repositories
  IUsersRepository: Symbol.for("IUsersRepository"),
};

export interface DI_RETURN_TYPES {
  // Services
  IAuthenticationService: IAuthenticationService;

  // Controllers
  IAuthenticationController: IAuthenticationController;

  // Use Cases
  IAuthenticationUseCases: IAuthenticationUseCases;

  // Repositories
  IUsersRepository: IUsersRepository;
}
