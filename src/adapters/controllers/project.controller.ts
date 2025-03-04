import { injectable, inject } from "inversify";
import { DI_SYMBOLS } from "@/di/types";
import type { IProjectUseCases } from "@/src/business/use-cases/project.use-cases.interface";

import { User } from "@/src/business/entities/models/user";
import { IProjectController } from "@/src/adapters/controllers/project.controller.interface";
import { Project } from "@/src/business/aggregates/project";
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

  public async getProjects(user: Pick<User, "id">): Promise<Project[]> {
    console.log(`Retrieving all projects for ${user}`);
    const userId = user.id;
    if (!userId) {
      throw new InputParseError("Invalid data", {
        cause: "User id is empty",
      });
    }

    try {
      return await this._projectUseCases.getProjects({ userId });
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
