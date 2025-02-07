"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getInjection } from "@/di/container";
import { AuthenticationError } from "@/src/business/entities/errors/auth";
import { FormState, SignupFormSchema } from "../lib/definitions";

import { DI_SYMBOLS } from "@/di/types";
import { IAuthenticationController } from "@/src/adapters/controllers/auth.controller.interface";
import { InputParseError } from "@/src/business/entities/errors/common";
import { Cookie } from "@/src/business/entities/models/cookie";

export async function signUpAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  console.log(`Action previous state is ${prevState}`);
  let sessionCookie: Cookie;
  try {
    const validationError = validateFormInput(formData);
    if (validationError) {
      return {
        errors: validationError.errors,
      };
    }

    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirm_password")?.toString();
    console.log("Sign-up action (UI)");
    console.log(formData);

    const authController = getInjection<IAuthenticationController>(
      DI_SYMBOLS.IAuthenticationController
    );
    const { cookie } = await authController.signUp({
      username,
      password,
      confirm_password: confirmPassword,
    });
    sessionCookie = cookie;
  } catch (err) {
    if (err instanceof InputParseError) {
      return {
        errors: [
          "Invalid data. Make sure the Password and Confirm Password match.",
        ],
      };
    }
    if (err instanceof AuthenticationError) {
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

  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  redirect("/");
}

export async function signInAction(formData: FormData) {
  console.log("Sign-in action (UI)");
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  let sessionCookie: Cookie;
  try {
    const authController = getInjection<IAuthenticationController>(
      DI_SYMBOLS.IAuthenticationController
    );
    sessionCookie = await authController.signIn({ email, password });
  } catch (err) {
    if (err instanceof InputParseError || err instanceof AuthenticationError) {
      return {
        error: "Incorrect username or password",
      };
    }
    return {
      error:
        "An error happened. The developers have been notified. Please try again later.",
    };
  }

  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  redirect("/");
}

function validateFormInput(formData: FormData) {
  console.log("Validating fields");

  const validatedFields = SignupFormSchema.safeParse({
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
