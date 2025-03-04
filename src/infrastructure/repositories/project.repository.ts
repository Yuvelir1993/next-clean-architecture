import { Project } from "@/src/business/aggregates/project";
import { IProjectRepository } from "@/src/infrastructure/repositories/project.repository.interface";

export class ProjectRepository implements IProjectRepository {
  getProjectsOfUser(userId: string): Promise<Project[] | undefined> {
    console.log(`Retrieving projects from AWS DynamoDB for user ${userId}`);
    throw new Error("Method not implemented.");
  }
}
