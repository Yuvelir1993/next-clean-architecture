import { z } from "zod";

import { InputParseError } from "@/src/entities/errors/common";
import { Cookie } from "@/src/entities/models/cookie";
import { ISignInUseCase } from "@/src/application/use-cases/auth/sign-in.use-case";

// TODO: such input schemas may be shared, otherwise validation rules duplication exists
const inputSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, { message: "Be at least 6 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export type ISignInController = ReturnType<typeof signInController>;

export const signInController =
  (signInUseCase: ISignInUseCase) =>
  async (input: Partial<z.infer<typeof inputSchema>>): Promise<Cookie> => {
    console.log("Entered sign-in controller...");
    const { data, error: inputParseError } = inputSchema.safeParse(input);

    if (inputParseError) {
      console.error("Error during parsing input schema: " + inputParseError);
      throw new InputParseError("Invalid data", { cause: inputParseError });
    }

    const { cookie } = await signInUseCase(data);
    return cookie;
  };
