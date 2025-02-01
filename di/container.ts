import { createContainer } from "@evyweb/ioctopus";

import { DI_RETURN_TYPES, DI_SYMBOLS } from "@/di/types";

import { createAuthenticationModule } from "@/di/modules/authentication.module";
import { createUsersModule } from "@/di/modules/users.module";

const ApplicationContainer = createContainer();

ApplicationContainer.load(
  Symbol("AuthenticationModule"),
  createAuthenticationModule()
);
ApplicationContainer.load(Symbol("UsersModule"), createUsersModule());

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
  symbol: K
): DI_RETURN_TYPES[K] {
  console.log("Getting injection...");
  return ApplicationContainer.get(DI_SYMBOLS[symbol]);
}
