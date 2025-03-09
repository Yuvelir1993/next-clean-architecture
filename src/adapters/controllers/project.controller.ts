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
  InputParseError,
  NotFoundError,
  ProjectError,
} from "@/src/business/entities/errors/common";
import { NoProjectsFoundError } from "@/src/business/entities/errors/project";

/**
 * ProjectController is a business-relevant entry point to execute projects use cases and services.
 */
@injectable()
export class ProjectController implements IProjectController {
  constructor(
    @inject(DI_SYMBOLS.IAuthenticationUseCases)
    private readonly _projectUseCases: IProjectUseCases
  ) {}

  createProject(input: CreateProjectInput): Promise<CreateProjectResult> {}

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
