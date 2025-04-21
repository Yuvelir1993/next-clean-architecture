import { Project } from "@/src/business/aggregates/project";
import { ProjectOwner } from "@/src/business/entities/models/user";
import { GitHubRepoURL } from "@/src/business/value-objects/gitHubRepo";
import { IProjectRepository } from "@/src/infrastructure/repositories/project.repository.interface";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

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

  /**
   * Retrieves all projects belonging to this user from DynamoDB,
   * and rehydrates them into Project aggregates.
   *
   * @param userData.userId - The unique identifier of the user.
   * @returns An array of Project instances, or `undefined` if an error occurs.
   * @throws Error for unexpected failures.
   */
  async getProjectsOfUser(userData: {
    userId: string;
  }): Promise<Project[] | undefined> {
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);

    const PK = `USER#${userData.userId}`;

    try {
      const responseFromDynamoDb = await docClient.send(
        new QueryCommand({
          TableName: "Projects",
          KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
          ExpressionAttributeValues: {
            ":pk": PK,
            ":skPrefix": "PROJECT#",
          },
        })
      );

      const retrievedProjects = responseFromDynamoDb.Items;
      if (!retrievedProjects || retrievedProjects.length === 0) {
        return [];
      }

      console.log("Retrieved project from DynamoDB");
      console.log(responseFromDynamoDb);

      // Manual hydration into Project aggregates
      const projects = retrievedProjects.map((item) => {
        const owner: ProjectOwner = {
          id: userData.userId,
          email: "",
          username: "",
        };
        return Project.fromPersistence({
          id: item.projectId as string,
          name: item.name as string,
          owner,
          description: item.description as string | undefined,
          githubRepo: GitHubRepoURL.create(item.gitHubRepoUrl as string),
          version: Number(item.version),
          createdAt: new Date(item.createdAt as string),
          updatedAt: new Date(item.updatedAt as string),
        });
      });

      return projects;
    } catch (error) {
      console.error(
        `Error retrieving projects for user '${userData.userId}':`,
        error
      );
      return undefined;
    }
  }

  /**
   * Deletes a project for a given user from the "Projects" DynamoDB table.
   *
   * @param input.projectId - The ID of the project to delete.
   * @param input.userId    - The ID of the user who owns the project.
   * @returns A promise that resolves to { success: true } on success.
   * @throws {Error} If the project does not exist for that user, or if the delete operation fails.
   */
  async deleteProjectOfUser(input: {
    projectId: string;
    userId: string;
  }): Promise<unknown> {
    const { projectId, userId } = input;
    const PK = `USER#${userId}`;
    const SK = `PROJECT#${projectId}`;

    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);

    const command = new DeleteCommand({
      TableName: "Projects",
      Key: { PK, SK },
      ConditionExpression: "PK = :pk AND SK = :sk",
      ExpressionAttributeValues: {
        ":pk": PK,
        ":sk": SK,
      },
    });

    try {
      await docClient.send(command);
      return { success: true };
    } catch (err: any) {
      if (err.name === "ConditionalCheckFailedException") {
        throw new Error(
          `Project "${projectId}" not found for user "${userId}".`
        );
      }
      throw new Error(`Failed to delete project: ${err.message}`);
    }
  }
}
