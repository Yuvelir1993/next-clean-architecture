import { injectable, inject } from "inversify";

import type { IProjectUseCases } from "@/src/business/application/use-cases/project.use-cases.interface";
import type { IProjectRepository } from "@/src/infrastructure/repositories/project.repository.interface";

import { DI_SYMBOLS } from "@/di/types";
import { Project } from "@/src/business/domain/aggregates/project";
import {
  ProjectCreationError,
  NoProjectsFoundError,
} from "@/src/business/errors";

@injectable()
export class ProjectUseCases implements IProjectUseCases {
  constructor(
    @inject(DI_SYMBOLS.IProjectRepository)
    private readonly _projectRepository: IProjectRepository
  ) {
    console.log("Instantiated 'AuthenticationUseCases'");
  }

  public async createProject(input: {
    owner: { userId: string; userEmail: string; userName: string };
    name: string;
    description: string;
    url: string;
  }): Promise<Project> {
    console.log(`Use Case -> Creating new project '${input}'`);

    const projectData = {
      name: input.name,
      description: input.description,
      url: input.url,
    };

    const project = await this._projectRepository.createProjectOfUser(
      projectData,
      input.owner
    );
    if (!project) {
      throw new ProjectCreationError(
        `Failed creating the project with input data ${input}`
      );
    }
    return project;
  }

  public async getProjects(input: { userId: string }): Promise<Project[]> {
    console.log(`Use Case -> Getting existing project for '${input}'`);

    const projects = await this._projectRepository.getProjectsOfUser({
      userId: input.userId,
    });
    if (!projects) {
      throw new NoProjectsFoundError(
        `No projects have been found for the user ${input.userId}`
      );
    }
    return projects;
  }

  public async deleteProject(input: {
    projectId: string;
    userId: string;
  }): Promise<void> {
    console.log(`Use Case -> Deleting new project '${input}'`);
    await this._projectRepository.deleteProjectOfUser({
      projectId: input.projectId,
      userId: input.userId,
    });
  }
}
