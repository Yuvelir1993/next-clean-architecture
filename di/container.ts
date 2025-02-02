import { BindingScopeEnum, Container } from "inversify";

import { AuthenticationModule } from "@/di/modules/authentication.module";
import { UsersModule } from "@/di/modules/users.module";

const ApplicationContainer = new Container({
  defaultScope: BindingScopeEnum.Singleton,
});
ApplicationContainer.load(AuthenticationModule);
ApplicationContainer.load(UsersModule);

export const getInjection = <T>(symbol: symbol) => {
  console.debug(`Getting injection for ${String(symbol)}`);
  return ApplicationContainer.get<T>(symbol);
};

export { ApplicationContainer };
