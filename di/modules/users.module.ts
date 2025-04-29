import { IUsersRepository } from "@/src/infrastructure/repositories/users.repository.interface";
import { UsersRepository } from "@/src/infrastructure/repositories/users.repository";
import { UsersRepositoryMock } from "@/src/infrastructure/repositories/users.repository.mock";

import { DI_SYMBOLS } from "@/di/types";
import { ContainerModule, interfaces } from "inversify";

const initializeUsersModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IUsersRepository>(DI_SYMBOLS.IUsersRepository).to(UsersRepositoryMock);
  } else {
    bind<IUsersRepository>(DI_SYMBOLS.IUsersRepository).to(UsersRepository);
  }
};
export const UsersModule = new ContainerModule(initializeUsersModule);
