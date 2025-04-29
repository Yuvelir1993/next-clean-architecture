import { BindingScopeEnum, Container } from "inversify";

import { AuthenticationModule } from "@/di/modules/authentication.module";
import { UsersModule } from "@/di/modules/users.module";
import { ProjectsModule } from "@/di/modules/projects.module";

const ApplicationContainer = new Container({
  defaultScope: BindingScopeEnum.Singleton,
});
ApplicationContainer.load(AuthenticationModule);
ApplicationContainer.load(UsersModule);
ApplicationContainer.load(ProjectsModule);

export const getInjection = <T>(symbol: symbol) => {
  console.debug(`Getting injection for ${String(symbol)}`);
  return ApplicationContainer.get<T>(symbol);
};

export { ApplicationContainer };
