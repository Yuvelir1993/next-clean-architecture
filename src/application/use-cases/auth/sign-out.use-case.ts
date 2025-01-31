import { Cookie } from "@/src/entities/models/cookie";
import type { IAuthenticationService } from "@/src/application/services/authentication.service.interface";

export type ISignOutUseCase = ReturnType<typeof signOutUseCase>;

export const signOutUseCase =
  (authenticationService: IAuthenticationService) =>
  async (sessionId: string): Promise<{ blankCookie: Cookie }> => {
    return await authenticationService.invalidateSession(sessionId);
  };
