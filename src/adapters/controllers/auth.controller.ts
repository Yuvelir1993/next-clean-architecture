import { z } from "zod";
import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";

import { IAuthenticationController } from "@/src/adapters/controllers/auth.controller.interface";
import {
  signInInputSchema,
  signUpInputSchema,
} from "./auth.controller.inputSchemas";
import type { IAuthenticationService } from "@/src/infrastructure/services/authentication.service.interface";
import type { IAuthenticationUseCases } from "@/src/business/use-cases/auth.use-cases.interface";

import { User } from "@/src/business/entities/models/user";
import { Cookie } from "@/shared/cookie/cookie.schema";
import { Session } from "@/shared/session/session.schema";
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
  ): Promise<{
    session: Session;
    cookie: Cookie;
    user: Pick<User, "id" | "username">;
  }> {
    console.log("Entered sign-in controller...");
    const validationResult = signInInputSchema.safeParse(input);
    if (!validationResult.success) {
      console.error(
        "Error during parsing sign-in input:",
        validationResult.error
      );
      throw new InputParseError("Invalid data", {
        cause: validationResult.error,
      });
    }

    return await this._authUseCases.signIn(validationResult.data);
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

  public async signOut(sessionToken: string | undefined): Promise<Cookie> {
    if (!sessionToken) {
      throw new InputParseError("Must provide a session token");
    }
    await this._authService.validateSession(sessionToken);
    const { blankCookie } = await this._authUseCases.signOut(sessionToken);
    return blankCookie;
  }
}
