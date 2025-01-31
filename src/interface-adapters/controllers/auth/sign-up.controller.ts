import { z } from "zod";

import { InputParseError } from "@/src/entities/errors/common";
import { ISignUpUseCase } from "@/src/application/use-cases/auth/sign-up.use-case";

const inputSchema = z
  .object({
    username: z.string().min(3).max(31),
    password: z.string().min(6).max(31),
    confirm_password: z.string().min(6).max(31),
  })
  .superRefine(({ password, confirm_password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["password"],
      });
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export type ISignUpController = ReturnType<typeof signUpController>;

export const signUpController =
  (signUpUseCase: ISignUpUseCase) =>
  async (
    input: Partial<z.infer<typeof inputSchema>>
  ): Promise<ReturnType<typeof signUpUseCase>> => {
    const { data, error: inputParseError } = inputSchema.safeParse(input);

    if (inputParseError) {
      throw new InputParseError("Invalid data", { cause: inputParseError });
    }

    return await signUpUseCase(data);
  };
