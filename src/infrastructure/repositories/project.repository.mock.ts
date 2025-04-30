import { Project } from "@/src/business/domain/aggregates/project";
import { IProjectRepository } from "@/src/infrastructure/repositories/project.repository.interface";

/**
 * Mock implementation of ProjectRepository.
 * Uses in-memory storage instead of DynamoDB.
 */
export class ProjectRepositoryMock implements IProjectRepository {
  private projects: Project[] = [];

  async createProjectOfUser(
    projectData: { name: string; description: string; url: string },
    projectOwner: { userId: string; userEmail: string; userName: string }
  ): Promise<Project> {
    console.log(
      `[mock] Creating project '${projectData.name}' for user '${projectOwner.userId}'`
    );

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

    this.projects.push(newProject);

    return newProject;
  }

  async getProjectsOfUser(userData: {
    userId: string;
  }): Promise<Project[] | undefined> {
    console.log(`[mock] Getting projects for user '${userData.userId}'`);

    const userProjects = this.projects.filter(
      (project) => project.owner.id === userData.userId
    );

    return userProjects;
  }

  async deleteProjectOfUser(input: {
    projectId: string;
    userId: string;
  }): Promise<unknown> {
    console.log(
      `[mock] Deleting project '${input.projectId}' for user '${input.userId}'`
    );

    const initialLength = this.projects.length;

    this.projects = this.projects.filter(
      (project) =>
        !(project.id === input.projectId && project.owner.id === input.userId)
    );

    if (this.projects.length === initialLength) {
      throw new Error(
        `Project "${input.projectId}" not found for user "${input.userId}".`
      );
    }

    return { success: true };
  }
}
