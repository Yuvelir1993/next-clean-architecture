"use server";

import { cookies } from "next/headers";

import { getInjection } from "@/di/container";
import { DI_SYMBOLS } from "@/di/types";
import { IAuthenticationController } from "@/src/adapters/controllers/auth.controller.interface";
import { redirect } from "next/navigation";
import { CreateProjectFormState } from "@/app/lib/definitions";
import { AWS_COGNITO_SESSION_COOKIE_NAME } from "@/shared/constants";
import { getSessionFromCookies } from "@/shared/session/session.service";
import { SessionValidationError } from "@/shared/session/session.errors";
import { IProjectController } from "@/src/adapters/controllers/project.controller.interface";
import { ProjectError } from "@/src/business/entities/errors/common";
import { mapProjectToDTO, ProjectDTO } from "@/dto/aggregates/project.dto";

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

export async function getProjects(): Promise<ProjectDTO[]> {
  console.log("Getting projects...");

  try {
    const sessionData = await getSessionFromCookies();
    const projectController = getInjection<IProjectController>(
      DI_SYMBOLS.IProjectController
    );

    const businessProjects = projectController.getProjects({
      id: sessionData.userId,
    });
    return (await businessProjects).map(mapProjectToDTO);
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

  // const dummyProjects: Project[] = [
  //   {
  //     id: "project-123",
  //     name: "My Awesome Project",
  //     owner: "Me",
  //     description: "This is a description of my awesome project.",
  //     repoLink: "https://github.com/username/my-awesome-project",
  //   },
  //   {
  //     id: "project-124",
  //     name: "Second Project",
  //     owner: "You",
  //     description: "This is a description of the second project.",
  //     repoLink: "https://github.com/username/second-project",
  //   },
  //   {
  //     id: "project-125",
  //     name: "Third Project",
  //     owner: "Us",
  //     description: "This is a description of the third project.",
  //     repoLink: "https://github.com/username/third-project",
  //   },
  //   {
  //     id: "project-126",
  //     name: "Fourth Project",
  //     owner: "Them",
  //     description: "This is a description of the fourth project.",
  //     repoLink: "https://github.com/username/fourth-project",
  //   },
  // ];

  // return dummyProjects;
}
