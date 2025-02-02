import { IUsersRepository } from "@/src/infrastructure/repositories/users.repository.interface";
import { UsersRepository } from "@/src/infrastructure/repositories/users.repository";

import { DI_SYMBOLS } from "@/di/types";
import { ContainerModule, interfaces } from "inversify";

const initializeModule = (bind: interfaces.Bind) => {
  bind<IUsersRepository>(DI_SYMBOLS.IUsersRepository).to(UsersRepository);
};
export const UsersModule = new ContainerModule(initializeModule);
