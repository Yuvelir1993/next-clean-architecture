import { Project } from "@/src/business/aggregates/project";
import { IProjectRepository } from "@/src/infrastructure/repositories/project.repository.interface";

export class ProjectRepository implements IProjectRepository {
  createProjectOfUser(
    projectData: { name: string; description: string; url: string },
    userData: { userId: string }
  ): Promise<Project> {
    console.log(`Creating project '${projectData}' in AWS DynamoDB for user '${userData}'`);
    throw new Error("Method not implemented.");
  }

  getProjectsOfUser(userData: {
    userId: string;
  }): Promise<Project[] | undefined> {
    console.log(`Retrieving projects from AWS DynamoDB for user '${userData}'`);
    throw new Error("Method not implemented.");
  }
}
