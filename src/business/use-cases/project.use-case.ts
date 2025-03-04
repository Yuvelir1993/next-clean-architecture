import { injectable, inject } from "inversify";

import type { IProjectUseCases } from "@/src/business/use-cases/project.use-cases.interface";
import type { IProjectRepository } from "@/src/infrastructure/repositories/project.repository.interface";

import { DI_SYMBOLS } from "@/di/types";
import { Project } from "@/src/business/aggregates/project";
import { NoProjectsFoundError } from "@/src/business/entities/errors/project";

@injectable()
export class ProjectUseCases implements IProjectUseCases {
  constructor(
    @inject(DI_SYMBOLS.IUsersRepository)
    private readonly _projectRepository: IProjectRepository
  ) {
    console.log("Instantiated 'AuthenticationUseCases'");
  }
  async getProjects(input: { userId: string }): Promise<Project[]> {
    const projects = await this._projectRepository.getProjectsOfUser(
      input.userId
    );
    if (!projects) {
      throw new NoProjectsFoundError(
        `No projects have been found for the user ${input.userId}`
      );
    }
    return projects;
  }
}
