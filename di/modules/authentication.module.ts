import { IAuthenticationUseCases } from "@/src/business/interfaces/use-cases/authentication.use-cases.interface";
import { AuthenticationUseCases } from "@/src/application/use-cases/auth.use-cases";

import { IAuthenticationService } from "@/src/infrastructure/services/authentication.service.interface";
import { AuthenticationService } from "@/src/infrastructure/services/authentication.service";

import { DI_SYMBOLS } from "@/di/types";
import { ContainerModule, interfaces } from "inversify";
import { IAuthenticationController } from "@/src/adapters/controllers/auth.controller.interface";
import { AuthenticationController } from "@/src/adapters/controllers/auth.controller";

const initializeModule = (bind: interfaces.Bind) => {
  bind<IAuthenticationUseCases>(DI_SYMBOLS.IAuthenticationUseCases).to(
    AuthenticationUseCases
  );
  bind<IAuthenticationService>(DI_SYMBOLS.IAuthenticationService).to(
    AuthenticationService
  );
  bind<IAuthenticationController>(DI_SYMBOLS.IAuthenticationController).to(
    AuthenticationController
  );
};

export const AuthenticationModule = new ContainerModule(initializeModule);
