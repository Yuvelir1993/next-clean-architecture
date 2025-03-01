"use server";

import { cookies } from "next/headers";

import { getInjection } from "@/di/container";
import { DI_SYMBOLS } from "@/di/types";
import { IAuthenticationController } from "@/src/adapters/controllers/auth.controller.interface";
import { redirect } from "next/navigation";
import { CreateProjectFormState } from "@/app/lib/definitions";

export async function signOutAction() {
  console.log("Signing out...");

  try {
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get("AwsCognitoSession")?.value;

    if (!sessionToken) {
      console.warn("No session token found.");
      return;
    }

    const authController = getInjection<IAuthenticationController>(
      DI_SYMBOLS.IAuthenticationController
    );
    const sessionCookie = await authController.signOut(sessionToken);

    console.log(
      `Obtained session after signing out: ${JSON.stringify(sessionCookie)}`
    );

    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    redirect("/");
  } catch {}
}

export async function createProjectAction(
  prevState: CreateProjectFormState,
  formData: FormData
): Promise<CreateProjectFormState> {
  console.log("Creating new project...");
  console.log(
    `Action previous state is ${prevState}. Form data is ${formData}`
  );

  // Extract values from formData
  const projectName = formData.get("projectName") as string;
  const description = formData.get("description") as string;
  const repoLink = formData.get("repoLink") as string;

  // Return dummy data to simulate a successful creation.
  return {
    message: "Project created successfully",
  };
}
