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
    const newProject = Project.create({
      name: projectData.name,
      description: projectData.description,
      repoLink: projectData.url,
      owner: {
        id: projectOwner.userId,
        email: projectOwner.userEmail,
        username: projectOwner.userName,
      },
    });

    console.log(`Defined business object Project '${newProject}'`);

    const putCommand = new PutCommand({
      TableName: "Projects",
      Item: {
        // In 'client-dynamodb', the AttributeValue would be required (`year: { N: 1981 }`)
        // 'lib-dynamodb' simplifies the usage ( `year: 1981` )
        year: 1981,
        // The preceding KeySchema defines 'title' as our sort (RANGE) key, so 'title'
        // is required.
        title: "The Evil Dead",
        // Every other attribute is optional.
        info: {
          genres: ["Horror"],
        },
      },
    });
    await docClient.send(putCommand);
    return Project.createEmpty();
  }

  async getProjectsOfUser(userData: {
    userId: string;
  }): Promise<Project[] | undefined> {
    console.log(`Retrieving projects from AWS DynamoDB for user '${userData}'`);
    throw new Error("Method not implemented.");
  }
}
