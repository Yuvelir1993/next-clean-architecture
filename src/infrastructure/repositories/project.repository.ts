import { Project } from "@/src/business/aggregates/project";
import { IProjectRepository } from "@/src/infrastructure/repositories/project.repository.interface";
import { ProjectInfraDTO } from "../dto/project.dto";

export class ProjectRepository implements IProjectRepository {
  createProjectOfUser(
    userId: string,
    project: ProjectInfraDTO
  ): Promise<boolean> {
    console.log(
      `Creating project '${project.name}' for user with id '${userId}'`
    );
    throw new Error("Method not implemented.");
  }
  getProjectsOfUser(userId: string): Promise<Project[] | undefined> {
    console.log(
      `Retrieving projects from AWS DynamoDB for user with id '${userId}'`
    );
    throw new Error("Method not implemented.");
  }
}
