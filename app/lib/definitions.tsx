import { z } from "zod";

/**
 * Auth
 */

export const AuthSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

// Sign-in schema (same as AuthSchema)
export const SignInFormSchema = AuthSchema;

// Sign-up schema (extends AuthSchema with name field)
export const SignupFormSchema = AuthSchema.extend({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
});

export type AuthFormErrors =
  | { name?: string[]; email?: string[]; password?: string[] }
  | string[];

export type AuthFormState =
  | {
      errors?: AuthFormErrors;
      message?: string;
    }
  | undefined;

/**
 * Projects
 */
export const CreateProjectSchema = z.object({
  projectName: z.string().min(1, { message: "Project name is required." }),
  repoLink: z.string().url({ message: "Please enter a valid URL." }),
  description: z.string().optional(),
});

export type CreateProjectFormErrors =
  | { projectName?: string[]; repoLink?: string[]; description?: string[] }
  | string[];

export type CreateProjectFormState =
  | {
      errors?: CreateProjectFormErrors;
      message?: string;
    }
  | undefined;
