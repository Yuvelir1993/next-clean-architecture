import { z } from "zod";

import { InputParseError } from "@/src/entities/errors/common";
import { Cookie } from "@/src/entities/models/cookie";
import { ISignInUseCase } from "@/src/application/use-cases/auth/sign-in.use-case";

const inputSchema = z.object({
  username: z.string().min(3).max(31),
  password: z.string().min(6).max(31),
});

export type ISignInController = ReturnType<typeof signInController>;

export const signInController =
  (signInUseCase: ISignInUseCase) =>
  async (input: Partial<z.infer<typeof inputSchema>>): Promise<Cookie> => {
    const { data, error: inputParseError } = inputSchema.safeParse(input);

    if (inputParseError) {
      throw new InputParseError("Invalid data", { cause: inputParseError });
    }

    const { cookie } = await signInUseCase(data);
    return cookie;
  };
