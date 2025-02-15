import { z } from "zod";
import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";

import {
  IAuthenticationController,
  signInInputSchema,
  signUpInputSchema,
} from "@/src/adapters/controllers/auth.controller.interface";
import type { IAuthenticationService } from "@/src/infrastructure/services/authentication.service.interface";
import type { IAuthenticationUseCases } from "@/src/business/use-cases/auth.use-cases.interface";

import { User } from "@/src/business/entities/models/user";
import { Cookie } from "@/src/business/entities/models/cookie";
import { Session } from "@/src/business/entities/models/session";
import { InputParseError } from "@/src/business/entities/errors/common";

/**
 * AuthController consolidates sign-in, sign-out, and sign-up controllers.
 *
 * It validates incoming requests using Zod and then delegates the business logic to the use cases.
 */
@injectable()
export class AuthenticationController implements IAuthenticationController {
  constructor(
    @inject(DI_SYMBOLS.IAuthenticationUseCases)
    private readonly _authUseCases: IAuthenticationUseCases,
    @inject(DI_SYMBOLS.IAuthenticationService)
    private readonly _authService: IAuthenticationService
  ) {}

  public async signIn(
    input: Partial<z.infer<typeof signInInputSchema>>
  ): Promise<Cookie> {
    console.log("Entered sign-in controller...");
    const result = signInInputSchema.safeParse(input);
    if (!result.success) {
      console.error("Error during parsing sign-in input:", result.error);
      throw new InputParseError("Invalid data", { cause: result.error });
    }
    // Call the aggregated signIn use case and return the cookie from the result
    const { cookie } = await this._authUseCases.signIn(result.data);
    return cookie;
  }

  public async signOut(sessionId: string | undefined): Promise<Cookie> {
    if (!sessionId) {
      throw new InputParseError("Must provide a session ID");
    }
    // Validate the session before signing out
    const { session } = await this._authService.validateSession(sessionId);
    const { blankCookie } = await this._authUseCases.signOut(session.id);
    return blankCookie;
  }

  public async signUp(
    input: Partial<z.infer<typeof signUpInputSchema>>
  ): Promise<{
    session: Session;
    cookie: Cookie;
    user: Pick<User, "id" | "email" | "username">;
  }> {
    console.log("Entered sign-up controller...");
    const result = signUpInputSchema.safeParse(input);
    if (!result.success) {
      console.error("Error during parsing sign-up input:", result.error);
      throw new InputParseError("Invalid data", { cause: result.error });
    }
    return await this._authUseCases.signUp(result.data);
  }
}
