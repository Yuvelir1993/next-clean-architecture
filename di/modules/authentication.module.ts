import { IAuthenticationUseCases } from "@/src/business/use-cases/auth.use-cases.interface";
import { AuthenticationUseCases } from "@/src/business/use-cases/auth.use-cases";

import { IAuthenticationService } from "@/src/infrastructure/services/authentication.service.interface";
import { AuthenticationService } from "@/src/infrastructure/services/authentication.service";
import { AuthenticationServiceMock } from "@/src/infrastructure/services/authentication.service.mock";

import { DI_SYMBOLS } from "@/di/types";
import { ContainerModule, interfaces } from "inversify";
import { IAuthenticationController } from "@/src/adapters/controllers/auth.controller.interface";
import { AuthenticationController } from "@/src/adapters/controllers/auth.controller";
import { AuthenticationControllerMock } from "@/src/adapters/controllers/auth.controller.mock";

const initializeAuthenticationModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IAuthenticationUseCases>(DI_SYMBOLS.IAuthenticationUseCases).to(
      AuthenticationUseCases
    );
    bind<IAuthenticationService>(DI_SYMBOLS.IAuthenticationService).to(
      AuthenticationServiceMock
    );
    bind<IAuthenticationController>(DI_SYMBOLS.IAuthenticationController).to(
      AuthenticationControllerMock
    );
  } else {
    bind<IAuthenticationUseCases>(DI_SYMBOLS.IAuthenticationUseCases).to(
      AuthenticationUseCases
    );
    bind<IAuthenticationService>(DI_SYMBOLS.IAuthenticationService).to(
      AuthenticationService
    );
    bind<IAuthenticationController>(DI_SYMBOLS.IAuthenticationController).to(
      AuthenticationController
    );
  }
};

export const AuthenticationModule = new ContainerModule(
  initializeAuthenticationModule
);
