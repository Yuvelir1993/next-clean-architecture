"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AWS_COGNITO_SESSION_COOKIE_NAME } from "@/shared/constants";
import { getSessionFromCookies } from "@/shared/session/session.service";
import { SessionValidationError } from "@/shared/session/session.errors";

import { CreateProjectFormState } from "@/app/lib/definitions";

import { getInjection } from "@/di/container";
import { DI_SYMBOLS } from "@/di/types";

import { ProjectError } from "@/src/business/entities/errors/common";

import { IProjectController } from "@/src/adapters/controllers/project.controller.interface";
import { IAuthenticationController } from "@/src/adapters/controllers/auth.controller.interface";
import {
  mapProjectToUiDTO,
  ProjectUiDTO,
} from "@/src/adapters/dto/aggregates/project.dto";

export async function signOutAction() {
  console.log("Signing out...");

  try {
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get(
      AWS_COGNITO_SESSION_COOKIE_NAME
    )?.value;

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

  const cookieStore = cookies();
  const sessionToken = (await cookieStore).get(
    AWS_COGNITO_SESSION_COOKIE_NAME
  )?.value;

  if (!sessionToken) {
    console.error(
      "No session token found during project creation. Necessary to get the project owner!"
    );
    return;
  }

  // Extract values from formData
  const projectName = formData.get("projectName") as string;
  const description = formData.get("description") as string;
  const repoLink = formData.get("repoLink") as string;
  console.log(`Creating project: ${projectName}, ${description}, ${repoLink}`);
  // Return dummy data to simulate a successful creation.
  return {
    message: "Project created successfully",
  };
}

export async function getProjects(): Promise<ProjectUiDTO[]> {
  console.log("Getting projects...");

  try {
    const sessionData = await getSessionFromCookies();
    const projectController = getInjection<IProjectController>(
      DI_SYMBOLS.IProjectController
    );

    const businessProjects = projectController.getProjects({
      id: sessionData.userId,
    });
    return (await businessProjects).map(mapProjectToUiDTO);
  } catch (error) {
    if (error instanceof SessionValidationError) {
      console.error(
        `Was not able to parse current user's session! Error: '${error.message}', Cause: '${error.cause}'`
      );
    } else if (error instanceof ProjectError) {
      console.error(
        `Was not able to retrieve user's projects! Error: '${error.message}', Cause: '${error.cause}'`
      );
    } else {
      console.error("Unhandled session extraction error:", error);
    }
    return [];
  }
}
