import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import type { IProjectUseCases } from "@/src/business/use-cases/project.use-cases.interface";

import {
  CreateProjectInput,
  GetProjectsInput,
} from "@/src/adapters/controllers/project.controller.inputSchemas";
import {
  CreateProjectResult,
  GetProjectsResult,
  IProjectController,
} from "@/src/adapters/controllers/project.controller.interface";
import {
  NotFoundError,
  ProjectError,
} from "@/src/business/entities/errors/common";
import { NoProjectsFoundError } from "@/src/business/entities/errors/project";
import { ProjectCreationError } from "@/src/business/aggregates/errors/project";

/**
 * ProjectController is a business-relevant entry point to execute projects use cases and services.
 */
@injectable()
export class ProjectController implements IProjectController {
  constructor(
    @inject(DI_SYMBOLS.IAuthenticationUseCases)
    private readonly _projectUseCases: IProjectUseCases
  ) {}

  public async createProject(
    input: CreateProjectInput
  ): Promise<CreateProjectResult> {
    console.log(`Creating new project '${input.name}' for '${input.owner}'`);

    try {
      return {
        success: true,
        project: await this._projectUseCases.createProject({
          name: input.name,
          owner: input.owner,
          description: input.description,
          url: input.gitHubRepoUrl,
        }),
      };
    } catch (error) {
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
    console.log(`Retrieving all projects for ${input.userId}`);
    const userId = input.userId;

    try {
      return {
        success: true,
        projects: await this._projectUseCases.getProjects({ userId }),
      };
    } catch (error) {
      if (error instanceof NoProjectsFoundError) {
        throw new NotFoundError("No projects has been found.");
      }
      throw new ProjectError(
        `Unexpected error when trying handle projects for user '${userId}'`
      );
    }
  }
}
