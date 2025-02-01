import { ISignOutUseCase } from "@/src/application/use-cases/auth/sign-out.use-case";
import { Cookie } from "@/src/entities/models/cookie";
import { InputParseError } from "@/src/entities/errors/common";
import { IAuthenticationService } from "@/src/application/interfaces/services/authentication.service.interface";

export type ISignOutController = ReturnType<typeof signOutController>;

export const signOutController =
  (
    authenticationService: IAuthenticationService,
    signOutUseCase: ISignOutUseCase
  ) =>
  async (sessionId: string | undefined): Promise<Cookie> => {
    if (!sessionId) {
      throw new InputParseError("Must provide a session ID");
    }
    const { session } = await authenticationService.validateSession(sessionId);

    const { blankCookie } = await signOutUseCase(session.id);
    return blankCookie;
  };
