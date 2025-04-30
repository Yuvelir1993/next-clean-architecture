import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import type { IProjectUseCases } from "@/src/business/application/use-cases/project.use-cases.interface";

import {
  CreateProjectInput,
  DeleteProjectInput,
  GetProjectsInput,
} from "@/src/adapters/controllers/project.controller.inputSchemas";
import {
  CreateProjectResult,
  GetProjectsResult,
  IProjectController,
} from "@/src/adapters/controllers/project.controller.interface";

import { ProjectError } from "@/src/adapters/errors";
import {
  NoProjectsFoundError,
  ProjectCreationError,
} from "@/src/business/errors";

/**
 * ProjectController is a business-relevant entry point to execute projects use cases and services.
 */
@injectable()
export class ProjectController implements IProjectController {
  constructor(
    @inject(DI_SYMBOLS.IProjectUseCases)
    private readonly _projectUseCases: IProjectUseCases
  ) {}

  public async createProject(
    input: CreateProjectInput
  ): Promise<CreateProjectResult> {
    console.log(
      `Controller -> Creating new project '${input.name}' for '${input.owner}'`
    );

    try {
      const createdProjectBusinessEntity =
        await this._projectUseCases.createProject({
          owner: {
            userId: input.owner.id,
            userName: input.owner.username,
            userEmail: input.owner.email,
          },
          name: input.name,
          description: input.description,
          url: input.gitHubRepoUrl,
        });

      return {
        success: true,
        project: createdProjectBusinessEntity,
      };
    } catch (error) {
      console.error(
        `Controller -> Error while creating project: ${JSON.stringify(
          input,
          null,
          2
        )}`
      );

      if (error instanceof ProjectCreationError) {
        throw new ProjectError(`Could not create project for '${input.owner}'`);
      }
      throw new ProjectError(
        `Unexpected error when trying to create project '${input.name}' for user '${input.owner}'`
      );
    }
  }

  public async getProjects(
    input: GetProjectsInput
  ): Promise<GetProjectsResult> {
    console.log(`Controller -> Retrieving all projects for ${input.userId}`);
    const userId = input.userId;

    try {
      return {
        success: true,
        projects: await this._projectUseCases.getProjects({ userId }),
      };
    } catch (error) {
      if (error instanceof NoProjectsFoundError) {
        throw new ProjectError("No projects has been found.", {
          cause: error.cause,
        });
      }
      throw new ProjectError(
        `Unexpected error when trying handle projects for user '${userId}'`
      );
    }
  }

  public async deleteProject(input: DeleteProjectInput): Promise<void> {
    console.log(`Deleting project ${input.projectId} of user ${input.userId}`);
    try {
      await this._projectUseCases.deleteProject({
        projectId: input.projectId,
        userId: input.userId,
      });
    } catch (error) {
      throw new ProjectError(
        `Unexpected error when trying delete project ${input.projectId} for user '${input.userId}'. Error: ${error}`
      );
    }
  }
}
