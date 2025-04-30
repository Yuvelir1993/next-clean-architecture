import { IAuthenticationController } from "@/src/adapters/controllers/auth.controller.interface";
import { IProjectController } from "@/src/adapters/controllers/project.controller.interface";

import { IAuthenticationUseCases } from "@/src/business/application/use-cases/auth.use-cases.interface";
import { IProjectUseCases } from "@/src/business/application/use-cases/project.use-cases.interface";

import { IAuthenticationService } from "@/src/infrastructure/services/authentication.service.interface";

import { IUsersRepository } from "@/src/infrastructure/repositories/users.repository.interface";
import { IProjectRepository } from "@/src/infrastructure/repositories/project.repository.interface";

// Symbols are guaranteed to be unique, preventing accidental name collisions.
export const DI_SYMBOLS = {
  // Services
  IAuthenticationService: Symbol.for("IAuthenticationService"),

  // Controllers
  IAuthenticationController: Symbol.for("IAuthenticationController"),
  IProjectController: Symbol.for("IProjectController"),

  // Use Cases
  IAuthenticationUseCases: Symbol.for("IAuthenticationUseCases"),
  IProjectUseCases: Symbol.for("IProjectUseCases"),

  // Repositories
  IUsersRepository: Symbol.for("IUsersRepository"),
  IProjectRepository: Symbol.for("IProjectRepository"),
};

export interface DI_RETURN_TYPES {
  // Services
  IAuthenticationService: IAuthenticationService;

  // Controllers
  IAuthenticationController: IAuthenticationController;
  IProjectController: IProjectController;

  // Use Cases
  IAuthenticationUseCases: IAuthenticationUseCases;
  IProjectUseCases: IProjectUseCases;

  // Repositories
  IUsersRepository: IUsersRepository;
  IProjectRepository: IProjectRepository;
}
