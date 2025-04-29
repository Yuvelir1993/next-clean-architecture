"use server";

import { redirect } from "next/navigation";
import { getInjection } from "@/di/container";
import { AuthenticationError } from "@/src/business/errors";
import {
  AuthFormState,
  SignInFormSchema,
  SignUpFormSchema as SignUpFormSchema,
  AuthSchema,
} from "@/app/lib/definitions";

import { DI_SYMBOLS } from "@/di/types";
import { IAuthenticationController } from "@/src/adapters/controllers/auth.controller.interface";
import { InputParseError } from "@/src/adapters/errors";
import setBrowserCookies from "@/shared/cookie/cookie.service";

export async function signUpAction(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  console.log(`Action previous state is ${prevState}`);
  try {
    const validationError = validateFormInput(formData, "sign-up");
    if (validationError) {
      return {
        errors: validationError.errors,
      };
    }

    const email = formData.get("email")?.toString();
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirm_password")?.toString();
    console.log("Sign-up action (UI)");
    console.log(formData);

    const authController = getInjection<IAuthenticationController>(
      DI_SYMBOLS.IAuthenticationController
    );
    const { cookie, session, user } = await authController.signUp({
      email,
      username,
      password,
      confirm_password: confirmPassword,
    });

    console.log("Session cookie to be set:");
    console.log(cookie);

    await setBrowserCookies(cookie, session, user);
  } catch (err) {
    if (err instanceof InputParseError) {
      return {
        errors: [
          "Invalid data. Make sure the Password and Confirm Password match.",
        ],
      };
    }
    if (err instanceof AuthenticationError) {
      console.error(`Failed authenticate user!`);
      return {
        errors: [err.message],
      };
    }

    return {
      errors: [
        "An error happened. The developers have been notified. Please try again later. Message: " +
          (err as Error).message,
      ],
    };
  }
  redirect("/dashboard");
}

export async function signInAction(
  prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  console.log("Sign-in action (UI)");
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  try {
    const validationError = validateFormInput(formData, "sign-in");
    if (validationError) {
      return {
        errors: validationError.errors,
      };
    }

    const authController = getInjection<IAuthenticationController>(
      DI_SYMBOLS.IAuthenticationController
    );
    const { cookie, session, user } = await authController.signIn({
      email,
      password,
    });

    await setBrowserCookies(cookie, session, user);
    console.log(`Session cookies has been set`);
  } catch (err) {
    if (err instanceof InputParseError || err instanceof AuthenticationError) {
      return {
        errors: ["Incorrect username or password"],
      };
    }
    return {
      errors: [
        "An error happened. The developers have been notified. Please try again later.",
      ],
    };
  }
  redirect("/dashboard");
}

function validateFormInput(formData: FormData, type: string) {
  let validatedFields: ReturnType<typeof AuthSchema.safeParse>;

  if (type === "sign-in") {
    validatedFields = SignInFormSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      console.error("Error validating fields");
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
  } else if (type === "sign-up") {
    validatedFields = SignUpFormSchema.safeParse({
      name: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      console.error("Error validating fields");
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
  }
}
