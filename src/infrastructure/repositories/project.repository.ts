import { Project } from "@/src/business/aggregates/project";
import { IProjectRepository } from "@/src/infrastructure/repositories/project.repository.interface";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

/**
 * TODO: should return business object? or just true/false or void with exception thrown?
 * The project itself can be managed on the top level, maybe no need to return it from here
 */
export class ProjectRepository implements IProjectRepository {
  async createProjectOfUser(
    projectData: { name: string; description: string; url: string },
    projectOwner: { userId: string; userEmail: string; userName: string }
  ): Promise<Project> {
    console.log(
      `Creating project '${projectData}' in AWS DynamoDB for user '${projectOwner}'`
    );
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);
    const newProjectBusinessEntity = Project.create({
      name: projectData.name,
      description: projectData.description,
      repoLink: projectData.url,
      owner: {
        id: projectOwner.userId,
        email: projectOwner.userEmail,
        username: projectOwner.userName,
      },
    });

    console.log(
      `Defined business object Project '${newProjectBusinessEntity}'`
    );

    const PK = `USER#${newProjectBusinessEntity.owner.id}`;
    const SK = `PROJECT#${newProjectBusinessEntity.id}`;

    const putCommand = new PutCommand({
      TableName: "Projects",
      Item: {
        PK,
        SK,
        projectId: newProjectBusinessEntity.id,
        name: newProjectBusinessEntity.name,
        description: newProjectBusinessEntity.description,
        gitHubRepoUrl: newProjectBusinessEntity.githubRepo.value,
        version: newProjectBusinessEntity.version,
        createdAt: newProjectBusinessEntity.createdAt.toISOString(),
        updatedAt: newProjectBusinessEntity.updatedAt.toISOString(),
      },
    });
    await docClient.send(putCommand);

    console.log(
      `Project '${SK}' of owner '${PK}' successfully persisted in DynamoDB.`
    );

    return newProjectBusinessEntity;
  }

  async getProjectsOfUser(userData: {
    userId: string;
  }): Promise<Project[] | undefined> {
    console.log(`Retrieving projects from AWS DynamoDB for user '${userData}'`);
    throw new Error("Method not implemented.");
  }
}
